import { Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";

class CommentDto {
    @IsNotEmpty()
    @IsString()
    body!: string;
}

export class CreateCommentDto {
    @ValidateNested()
    @Type(() => CommentDto)
    comment: CommentDto;
}
