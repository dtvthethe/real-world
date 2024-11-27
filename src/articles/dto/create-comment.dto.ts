import { Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";

class CommentDto {
    @IsNotEmpty()
    @IsString()
    readonly body!: string;
}

export class CreateCommentDto {
    @ValidateNested()
    @Type(() => CommentDto)
    readonly comment: CommentDto;
}
