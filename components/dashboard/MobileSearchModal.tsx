import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

type Props = Readonly<{
  open: boolean;
  setOpen: (open: boolean) => void;
  currentQuery?: string;
}>;

const searchSchema = z.object({
  query: z.string(),
});

type SearchProps = z.infer<typeof searchSchema>;

const MobileSearchModal = ({ open, setOpen, currentQuery }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const searchForm = useForm<SearchProps>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: currentQuery,
    },
  });
  const router = useRouter();
  const { reset } = searchForm;

  useEffect(() => {
    reset({ query: currentQuery });
  }, [currentQuery, reset]);

  const onSubmit = (values: SearchProps) => {
    if (inputRef.current) inputRef.current.blur();
    const newQuery = values.query.trim();
    if (!newQuery) return;

    const params = new URLSearchParams();
    params.set("search_query", newQuery);

    router.push(`/results?${params.toString()}` as Route);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search on Glitch</DialogTitle>
          <DialogDescription className="sr-only">
            Enter your search query
          </DialogDescription>
        </DialogHeader>
        <Form {...searchForm}>
          <form
            className="flex flex-col w-full items-end"
            onSubmit={searchForm.handleSubmit(onSubmit)}
          >
            <div className="relative w-full">
              <FormField
                control={searchForm.control}
                name="query"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        ref={inputRef}
                        accessKey="/"
                        placeholder="Search"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button className="mt-3" type="submit" variant="default">
              <Search />
              <span>Search</span>
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MobileSearchModal;
