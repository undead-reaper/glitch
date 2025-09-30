"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const searchSchema = z.object({
  query: z.string(),
});

type SearchProps = z.infer<typeof searchSchema>;

const Searchbar = () => {
  const params = useSearchParams();
  const currentQuery = params.get("search_query") || "";

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
  };

  return (
    <Form {...searchForm}>
      <form
        className="flex w-full max-w-sm"
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
                    className="rounded-l-full md:block hidden"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          variant="ghost"
          className="md:rounded-r-full w-12 md:bg-primary hover:bg-primary/80! hover:text-white cursor-pointer"
        >
          <Search />
        </Button>
      </form>
    </Form>
  );
};

export default Searchbar;
