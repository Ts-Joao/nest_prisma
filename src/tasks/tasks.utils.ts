import { Injectable } from "@nestjs/common";

@Injectable()
export class TasksUtils {
    splintString(str: string): string[] {
        return str.split(' ')
    }
}