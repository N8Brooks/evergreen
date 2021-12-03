import {
  httpErrors,
  log,
  requireAuth,
  RequireAuthState,
  Router,
  superstruct,
  VoteSortKeysBuilder,
} from "../deps.ts";
import { commentCreatedPublisher } from "../events/comment_created_publisher.ts";
import { comments } from "../models/comments.ts";
import { submissions, SubmissionSchema } from "../models/submissions.ts";
import { CreateCommentData } from "./create_comment_data.ts";

interface CommentsForSubmissionState extends RequireAuthState {
  submission: SubmissionSchema;
}

/** /api/submissions/:submissionId/comments */
const router = new Router<CommentsForSubmissionState>()
  .use(async (context, next) => {
    // Get referenced submission from database
    const { submissionId } = context.params;
    const submissionFilter = { _id: submissionId };
    const submission = await submissions.findOne(submissionFilter);
    if (!submission) {
      throw new httpErrors.NotFound("Submission does not exist");
    }
    context.state.submission = submission;
    await next();
  })
  .get("/", async (context) => {
    // Return 200 with comments for submission
    const submissionId = context.params.submissionId!;
    context.response.body = await comments
      .find({ submissionId })
      .toArray();
  })
  .use(requireAuth)
  .post("/", async (context) => {
    const result = context.request.body();
    const data = await result.value;
    superstruct.assert(data, CreateCommentData);
    const { text } = data;

    // Extraneous data
    const { userId, userName, submission } = context.state;
    const { _id: topicId, topicName } = submission;
    const submissionId = context.params.submissionId!;
    const [language] = context.request.acceptsLanguages() ?? [];
    const createdAt = Date.now();

    // Insert record
    const _id = await comments.insertOne({
      createdAt,
      language,
      topicId,
      topicName,
      userId,
      userName,
      submissionId,
      text,
      ...VoteSortKeysBuilder.default,
    });
    const id = _id.toString();

    // Debug
    log.debug(`User ${userName} commented ${id} on submission ${submissionId}`);

    // Publish event
    commentCreatedPublisher.publish({
      id,
      createdAt,
      language,
      topicId,
      topicName,
      userId,
      userName,
      submissionId,
      text,
    });

    // Respond
    context.response.body = { id };
    context.response.status = 201;
  });

export { router as commentsForSubmission };
