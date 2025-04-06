import {model, models, Schema, Types} from "mongoose";

export interface IQuestion {
    title: string;
    content: string;
    tags: Types.ObjectId[];
    author: Types.ObjectId;
    upvotes: number;
    answers: number;
    views: number;

}
export interface IQuestionDoc extends IQuestion, Document {}


const QuestionSchema = new Schema<IQuestion>({
    title:{type: String, required: true},
    content:{type: String, required: true},
    tags:[{type: Schema.Types.ObjectId, ref: 'Tag'}],
    author:{type: Schema.Types.ObjectId, ref: 'User', required: true},
    upvotes:{type: Number, default: 0},
    answers:{type: Number, default: 0},
    views:{type: Number, default: 0},



}, {timestamps: true});

const Question = models?.Question || model<IQuestion>("Question", QuestionSchema);

export default Question;
