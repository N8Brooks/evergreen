import { DataTypes, Model } from "https://deno.land/x/denodb@v1.0.39/mod.ts";

export class Post extends Model {
  static table = "posts";
  static timestamps = true;

  static fields = {
    id: { primaryKey: true, autoIncrement: true },
    upVotes: DataTypes.INTEGER,
    downVotes: DataTypes.INTEGER,
    // topicId: DataTypes.STRING,
    // userId: DataTypes.STRING,
    // comments: relationship
    title: DataTypes.STRING,
    url: DataTypes.STRING,
  };

  static defaults = {
    upVotes: 0,
    downVotes: 0,
    title: "",
    url: "",
  };
}
