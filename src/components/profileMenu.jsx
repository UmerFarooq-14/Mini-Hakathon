import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem, 
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {signOut } from "firebase/auth";
import useAppStore from "../store"
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ProfileMenu() {
    const {setUserId} = useAppStore()
    const navigate = useNavigate()
    const logout = async()=>{
        await signOut(auth)
        setUserId("")
        navigate("/login")
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">Profile</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuItem onClick={logout}>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
