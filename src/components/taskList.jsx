import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { collection, query, doc, deleteDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { Check, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import AddTask from "./addTask";

export default function TaskList({ showButton = true }) {
    const [tasks, setTasks] = useState([]);
    const [editTask, setEditTask] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const init = () => {
        const collectionRef = collection(db, "add-task")
        const q = query(collectionRef);
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data = [];
            querySnapshot.forEach((doc) => {
                const dataWithId = { ...doc.data(), id: doc.id }
                data.push(dataWithId);
            });
            setTasks(data)
        });
        return unsubscribe
    }

    const deleteData = async (id) => {
        try {
            const documentRef = doc(db, "add-task", id)
            await deleteDoc(documentRef)
            toast("Record has been deleted")

        } catch (error) {
            toast(error.message)
        }
    }

    const markAsCommpleted = async (id) => {
        try {
            const documentRef = doc(db, "add-task", id)
            await updateDoc(documentRef, { status: "Completed" });
            toast("Task marked as Completed")
        } catch (error) {
            toast(error.message)
            console.log(error.message)
        }
    }


    useEffect(() => {
        init()
    }, [])

    return (
        <>

            {showButton && (
                <div className="flex justify-end m-4">
                    <Button variant="outline"
                        onClick={() => {
                            setEditTask(null)
                            setIsFormOpen(true)
                        }}
                    >Add Task</Button>
                </div>
            )}

            <Table className="border-2 mt-4">

                <TableHeader>
                    <TableRow>
                        <TableHead >Name</TableHead>
                        <TableHead >Description</TableHead>
                        <TableHead >Deadline</TableHead>
                        <TableHead >Status</TableHead>
                        <TableHead >Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tasks.map((task) => (
                        <TableRow key={task.id}>
                            <TableCell className="font-medium">{task.name}</TableCell>
                            <TableCell>{task.description}</TableCell>
                            <TableCell>{task.deadline}</TableCell>
                            <TableCell>{task.status}</TableCell>
                            <TableCell className="flex gap-4">

                                <Trash
                                    size={16}
                                    onClick={() => {
                                        deleteData(task.id)
                                    }}
                                />
                                <Pencil
                                    size={16}
                                    onClick={() => {
                                        setEditTask(task)
                                        setIsFormOpen(true)
                                    }}
                                />
                                {task.status !== "Completed" && (
                                    <Check
                                        className="cursor-pointer text-green-500"
                                        onClick={() => markAsCommpleted(task.id)}
                                        size={16} />
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <AddTask
                editTask={editTask}
                setEditTask={setEditTask}
                open={isFormOpen}
                setOpen={setIsFormOpen}
            />
        </>
    )
}
