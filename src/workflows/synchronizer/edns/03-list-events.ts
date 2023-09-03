import "source-map-support/register";
import { Handler } from "aws-lambda";
import { EdnsEventType } from "../../../constants/event-type.constant";

export const index: Handler<undefined, string[]> = async () => {
	return [...Object.values(EdnsEventType)];
};
