"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
];
const ACCEPTED_IMAGE_TYPES = ["jpeg", "jpg", "png"];

const FormSchema = z.object({
    content: z.string().min(6, {
        message: "Content must be at least 6 characters.",
    }),
    image: z
        .any()
        .refine((file) => file.size < MAX_FILE_SIZE, "Max size is 5MB.")
        .refine(
            (file) => ACCEPTED_IMAGE_MIME_TYPES.includes(file?.type),
            `Only ${ACCEPTED_IMAGE_TYPES.join(", ")} formats are supported.`
        ),
})

export default function CreatePostForm() {
    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            content: "zain rajpoot",
            image: undefined,
        },
    })

    function onSubmit(post) {
        console.log(post);
    }



    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                                <Textarea
                                    className="w-full"
                                    row={6}
                                    placeholder="post content..."
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                This is your public display content.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                                <Input
                                    className="w-full"
                                    type="file"
                                    // accept="image/png, image/jpeg, image/jpg"
                                    onChange={(e) => {
                                        field.onChange(e.target.files[0]);
                                    }}
                                    ref={field.ref}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end items-center">
                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </Form>
    )
}
