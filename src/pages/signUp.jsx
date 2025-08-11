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
import { createUserWithEmailAndPassword,sendEmailVerification } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase"
import { toast } from "sonner"
import { useState } from "react"


export default function SignUp() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  }
  const loginSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid Email").required("Email is required"),
    password: Yup.string().min(6, "Password cannot be less than 6 characters").required("Password is required"),
    confirmPassword: Yup.string().oneOf([Yup.ref("password"), null], "Password must match").required("Confirm password is requried")
  })
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true)
        const createUser = await createUserWithEmailAndPassword(auth, values.email, values.password)
        if (createUser) {
         await sendEmailVerification(auth.currentUser)
          toast("User has been created. Please verified your email through spam section in your gmail account")
          const docRef = await addDoc(collection(db, "users"), {
            name:values.name,
            email:values.email,
            timestamp:serverTimestamp(),
          });
          navigate("/login")
          formik.resetForm()
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
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />
              </div>
              {formik.errors.name && formik.touched.name && (
                <span className="text-red-500 text-[12px]">{formik.errors.name}</span>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
              </div> {formik.errors.email && formik.touched.email && (
                <span className="text-red-500 text-[12px]">{formik.errors.email}</span>
              )}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
              </div> {formik.errors.password && formik.touched.password && (
                <span className="text-red-500 text-[12px]">{formik.errors.password}</span>
              )}
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                />
              </div>
              {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                <span className="text-red-500 text-[12px]">{formik.errors.confirmPassword}</span>
              )}

            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            onClick={() => formik.submitForm()}
            disabled={loading}
            className="w-full">
            {loading ? "Account Creating..." : "Create Account"}
          </Button>
          <div>
            <p>
              Already have an acount?{" "}
              <Link to={"/login"}
                className="underline cursor-pointer">
                Sign In
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
