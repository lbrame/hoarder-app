import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useClientConfig } from "@/lib/clientConfig";
import { api } from "@/lib/trpc";

import type { ZBookmark } from "@hoarder/trpc/types/bookmarks";

export function NoteEditor({ bookmark }: { bookmark: ZBookmark }) {
  const demoMode = !!useClientConfig().demoMode;

  const invalidateBookmarkCache =
    api.useUtils().bookmarks.getBookmark.invalidate;

  const updateBookmarkMutator = api.bookmarks.updateBookmark.useMutation({
    onSuccess: () => {
      toast({
        description: "The bookmark has been updated!",
      });
    },
    onError: () => {
      toast({
        description: "Something went wrong while saving the note",
        variant: "destructive",
      });
    },
    onSettled: () => {
      invalidateBookmarkCache({ bookmarkId: bookmark.id });
    },
  });

  return (
    <Textarea
      className="h-44 w-full overflow-auto rounded bg-background p-2 text-sm text-gray-400 dark:text-gray-300"
      defaultValue={bookmark.note ?? ""}
      disabled={demoMode}
      placeholder="Write some notes ..."
      onBlur={(e) => {
        if (e.currentTarget.value == bookmark.note) {
          return;
        }
        updateBookmarkMutator.mutate({
          bookmarkId: bookmark.id,
          note: e.currentTarget.value,
        });
      }}
    />
  );
}
