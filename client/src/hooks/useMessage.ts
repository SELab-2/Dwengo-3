import { useMutation } from '@tanstack/react-query';
import { createMessage } from '../api/message';

/**
 * A custom hook to create a message.
 *
 * @returns A mutation function to create a message.
 */
export function useCreateMessage() {
  return useMutation({
    mutationFn: async ({
      discussionId,
      content,
      senderId,
    }: {
      discussionId: string;
      content: string;
      senderId: string;
    }) => {
      return await createMessage({ discussionId, content, senderId });
    },
  });
}
