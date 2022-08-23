import { PREFIX_TOPIC } from "../constants";
import removePrefixTopic from "./removePrefixTopic";

// eslint-disable-next-line no-undef
describe("Topic test", () => {
    // eslint-disable-next-line no-undef
    it('remove topic has prefix topic', () => {
        const topicWithPrefix = `${PREFIX_TOPIC}bali`;
        // eslint-disable-next-line no-undef
        const result = removePrefixTopic(topicWithPrefix);
        const exprected = 'bali';
        // eslint-disable-next-line no-undef
        expect(result).toBe(exprected);
    });
    // eslint-disable-next-line no-undef
    it('remove topic has not topic', () => {
        const topicWithPrefix = `bali`;
        // eslint-disable-next-line no-undef
        const result = removePrefixTopic(topicWithPrefix);
        const exprected = 'bali';
        // eslint-disable-next-line no-undef
        expect(result).toBe(exprected);
    });
})

