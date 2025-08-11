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
import { useFormik } from "formik"
import { Link, useNavigate } from "react-router-dom"
import * as Yup from "yup"
import { getAuth, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"
import { toast } from "sonner"
import { useState } from "react"
import useAppStore from "../store"

export default function Login() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { setUserId, userId } = useAppStore()
    const initialValues = {
        email: "",
        password: "",
    }
    const loginSchema = Yup.object().shape({
        email: Yup.string().email("Invalid Email").required("Email is required"),
        password: Yup.string().required("Password is required")
    })
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: loginSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true)
                const signInUser = await signInWithEmailAndPassword(auth, values.email, values.password)
                if (signInUser) {
                    if (signInUser?.user?.emailVerified) {
                        toast("Login Successful")
                        setUserId(signInUser?.user?.uid)
                        formik.resetForm()
                        navigate("/mainPage")
                    } else {
                        await sendEmailVerification(auth.currentUser)
                        toast("Please Verified Your email to proceed further")
                    }
                } else {
                    toast("Please create an account to proceed further")
                }

            } catch (error) {
                toast(error.message)
            } finally {
                setLoading(false)
            }
        }
    })
    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
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
                                    required
                                />
                            </div>
                            {formik.errors.email && formik.touched.email && (
                                <span className="text-red-500 text-[12px]">{formik.errors.email}</span>
                            )}
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <Link to={'/forgetPassword'}
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forget Your Password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange} />
                            </div>
                            {formik.errors.password && formik.touched.password && (
                                <span className="text-red-500 text-[12px]">{formik.errors.password}</span>
                            )}
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button
                        onClick={() => formik.submitForm()}
                        disabled={loading}
                        className="w-full">
                        {loading ? "Logging..." : "Log In"}
                    </Button>
                    <div>
                        <p>
                            Create new account?
                            {' '}
                            <Link to={"/signUp"}
                                className="underline cursor-pointer">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
