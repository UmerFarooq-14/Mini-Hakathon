import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormik } from "formik"
import * as Yup from "yup"
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { db } from "../firebase"

export default function AddTask({ editTask, setEditTask, open, setOpen }) {
    const [loading, setLoading] = useState(false)
    const initialValues = {
        name: "",
        description: "",
        deadline: "",
        
    };
    const addTaskSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        description: Yup.string().required("Description is required"),
        deadline: Yup.date().min(new Date(new Date().setHours(0,0,0,0)),"Deadline cannot be in the past").required("Deadline is required"),
    })
    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema: addTaskSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true)
                if (editTask) {
                    const documentRef = doc(db, "add-task", editTask.id)
                    await updateDoc(documentRef,{...values});
                    toast("Record has been updated")
                } else {
                    const collectionRef = collection(db, "add-task")
                    const data = {
                        name: values.name,
                        description: values.description,
                        deadline:new Date(values.deadline).toLocaleDateString().split("T")[0],
                        status:"pending",
                    }
                    const docRef = await addDoc(collectionRef, data);
                    toast("Record has been added")

                }
                formik.resetForm()
                setEditTask(null)
                setOpen(false)
            } catch (error) {
                toast(error.message)
            } finally {
                setLoading(false)
            }
        }
    })

    useEffect(()=>{
        if(editTask){
            formik.setValues({
                name:editTask.name || "",
                description:editTask.description || "",
                deadline:editTask.deadline || "",
            })
        }
    },[editTask])

    return (
        <Dialog open={open} onChange={setOpen}>
            <form>
                {/* <DialogTrigger asChild>
                    <Button variant="outline">Add Task</Button>
                </DialogTrigger> */}
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Task Form</DialogTitle>
                        <DialogDescription>
                            Add your tasks here.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="taskName">Task Name</Label>
                            <Input id="taskName"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                            />
                        </div>
                        {formik.errors.name && formik.touched.name && (
                            <span className="text-red-500 text-[12px]">{formik.errors.name}</span>
                        )}
                        <div className="grid gap-3">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description"
                                name="description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                            />
                        </div>
                        {formik.errors.description && formik.touched.description && (
                            <span className="text-red-500 text-[12px]">{formik.errors.description}</span>
                        )}
                        <div className="grid gap-3">
                            <Label htmlFor="deadline">Deadline</Label>
                            <Input id="deadline"
                                name="deadline"
                                type="date"
                                min={new Date().toISOString().split("T")[0]}
                                value={formik.values.deadline}
                                onChange={formik.handleChange}
                            />
                        </div>
                        {formik.errors.deadline && formik.touched.deadline && (
                            <span className="text-red-500 text-[12px]">{formik.errors.deadline}</span>
                        )}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline"
                             onClick={()=>{
                                setOpen(false)
                                formik.resetForm()
                             }}
                            >Cancel</Button>
                        </DialogClose>
                        <Button onClick={() => {
                            formik.submitForm()
                        }}>
                            {loading ? "Saving..." || "Updating..." : editTask ? "Update" : "save" }
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
