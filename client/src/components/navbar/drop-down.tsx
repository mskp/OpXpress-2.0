import { logout } from "@/actions/auth";
import { BaggageClaim, LogIn, LogOut, UserRoundPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { toast } from "../ui/use-toast";

export function AuthenticatedDropdown() {
  const router = useRouter();
  async function handleLogout() {
    await logout();
    toast({
      title: "Logged out successfully",
    });
    router.replace("/login");
  }
  return (
    <DropdownMenuContent className="w-60">
      <DropdownMenuGroup>
        <DropdownMenuItem
          onClick={() => router.push("/orders")}
          className="cursor-pointer"
        >
          <BaggageClaim className="mr-2 h-4 w-4" />
          <span>My Orders</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        <span>Log out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}

export function UnauthenticatedDropdown() {
  const router = useRouter();
  return (
    <DropdownMenuContent className="w-60">
      <DropdownMenuGroup>
        <DropdownMenuItem
          onClick={() => router.push("/login")}
          className="cursor-pointer"
        >
          <LogIn className="mr-2 h-4 w-4" />
          <span>Login</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={() => router.push("/signup")}
        className="cursor-pointer"
      >
        <UserRoundPlus className="mr-2 h-4 w-4" />
        <span>Signup</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
