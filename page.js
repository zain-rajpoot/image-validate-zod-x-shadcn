"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import { ImageUp } from "lucide-react"
import { UserContext } from "@/Context"
import { useContext } from "react"
import { AddUserPostToBD } from "@/Appwrite/Database"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
const MAX_FILE_SIZE = 1024 * 1024 * 2;
const ACCEPTED_IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
];
const ACCEPTED_IMAGE_TYPES = ["jpeg", "jpg", "png"];
const FormSchema = z.object({
    caption: z.string().min(6, {
        message: "Caption must be at least 6 characters.",
    }).optional(),
    image: z
        .any()
        .refine((file) => file?.size < MAX_FILE_SIZE, "Max size 2MB is allowed.")
        .refine(
            (file) => ACCEPTED_IMAGE_MIME_TYPES.includes(file?.type),
            `Only ${ACCEPTED_IMAGE_TYPES.join(", ")} images are supported.`
        ),
})

export default function CreatePostForm() {
    const router = useRouter()
    const { UserData } = useContext(UserContext);
    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            caption: "",
            image: null,
        },
    })

    async function onSubmit(post) {
        const { data, error } = await AddUserPostToBD({ ...post, userId: UserData?.$id })
        if (data) {
            form.reset()
            toast.success("Successfully added a new post")
            router.push("/")
        } else {
            toast.error(error)
        }
    }



    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                <FormField
                    control={form.control}
                    name="caption"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Caption</FormLabel>
                            <FormControl>
                                <Textarea
                                    className="w-full"
                                    row={6}
                                    placeholder="post content..."
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                This is your public display caption.
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
                            <FormLabel>Image ({ACCEPTED_IMAGE_TYPES.join(", ")})</FormLabel>
                            <FormControl>
                                <label>
                                    {form.watch("image") ?
                                        <img
                                            src={URL.createObjectURL(form.watch("image"))}
                                            alt="selected-file"
                                            className="rounded-md cursor-pointer w-full h-96 object-cover"
                                        />
                                        :
                                        <div className="w-full gap-5 flex-col h-96 my-3 flex justify-center items-center border-dashed cursor-pointer border-4 rounded-md">
                                            <ImageUp className="w-40 h-40" />
                                            <span className="text-gray-400 text-xs">
                                                Select an image ({ACCEPTED_IMAGE_TYPES.join(", ")})
                                            </span>
                                        </div>
                                    }
                                    <input
                                        className="hidden"
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg"
                                        onChange={(e) => {
                                            field.onChange(e.target.files[0]);
                                        }}
                                        ref={field.ref}
                                    />
                                </label>
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
