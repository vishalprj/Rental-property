"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Login from "../login/index";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { AiOutlineMenu } from "react-icons/ai";
import { ShoppingCart } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();
  useEffect(() => {
    const storedUsername = localStorage.getItem("user");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLoginSuccess = (username: string) => {
    setUsername(username);
    setLoginOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    setUsername("");
  };

  return (
    <>
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-xl font-bold">
              <Link href="/" className="text-blue-600">
                Rental House
              </Link>
            </div>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link
              href="/"
              className={`${pathname === "/" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`}
            >
              Home
            </Link>
            <Link
              href="/property"
              className={`${pathname === "/property" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`}
            >
              Property
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {username ? (
              <div className="flex items-center space-x-2">
                <img
                  src="https://github.com/shadcn.png"
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-gray-700">{username}</span>
                <Button variant="link" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Button variant="link" onClick={() => setLoginOpen(true)}>
                Login
              </Button>
            )}
            <button onClick={() => router.push("/cart")}>
              <ShoppingCart
                className={`text-2xl ${
                  pathname === "/cart" ? "text-blue-600" : "hover:text-blue-600"
                }`}
              />
            </button>
          </div>
          <div className="md:hidden">
            <Drawer>
              <DrawerTrigger>
                <AiOutlineMenu
                  size={24}
                  className="text-gray-700 focus:outline-none"
                />
              </DrawerTrigger>
              <DrawerContent className="fixed inset-y-0 right-0 w-64 bg-white shadow-lg transform transition-transform translate-x-full z-50">
                <DrawerHeader>
                  <DrawerTitle>Navigation</DrawerTitle>
                </DrawerHeader>
                <div className="flex flex-col p-4 space-y-4">
                  <Link
                    href="/"
                    className={`${
                      pathname === "/"
                        ? "text-blue-600"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                    onClick={() => setLoginOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/property"
                    className={`${
                      pathname === "/property"
                        ? "text-blue-600"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                    onClick={() => setLoginOpen(false)}
                  >
                    Property
                  </Link>
                </div>
                <DrawerFooter>
                  <DrawerClose>
                    <Button variant="outline">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </nav>

      {isLoginOpen && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setLoginOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
