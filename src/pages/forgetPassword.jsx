import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"
import {  sendPasswordResetEmail } from "firebase/auth"
import { toast } from "sonner"
import { useState } from "react"
import { auth } from "../firebase"


export default function ForgetPassword() {
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()

    const initialValues = {
        email: "",
    }
    const loginSchema = Yup.object().shape({
        email: Yup.string().email("Invalid Email").required("Email is required"),
    })
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: loginSchema,
        onSubmit:async (values) => {
            try {
                setLoading(true)
                await sendPasswordResetEmail(auth, values.email)
                toast("Password Reset email send to your account")
                formik.resetForm()
                navigate('/login')
            } catch (error) {
                toast(error.message)
            }finally{
                setLoading(false)
            }
        }
    })
    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Forget Password</CardTitle>
                    <CardDescription>
                        Enter your email and we'll send you a link to reset your password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                />
                            </div>
                            {formik.errors.email && formik.touched.email && (
                                <span className="text-red-500 text-[12px]">{formik.errors.email}</span>
                            )}
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button
                    onClick={()=>formik.submitForm()}
                    disabled={loading}
                    className="w-full">
                        {loading ? "Reset Email Sending..." : "Reset Email Send"}
                    </Button>
                    <div>
                        <p>
                            Remember your password?
                            <Link to={"/login"}
                                className="underline cursor-pointer">
                                Back to Login
                            </Link>
                        </p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
