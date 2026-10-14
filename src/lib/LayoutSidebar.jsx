
import {Bars, Bell, Envelope, Gear, House, Magnifier, Person, PersonGear, StarFill} from "@gravity-ui/icons";
import {Button, Drawer} from "@heroui/react";
import { Blender, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { CgAdd } from "react-icons/cg";
import { GiLoveHowl, GiLovers } from "react-icons/gi";

export default function Layout() {
  const navItems = [
    {icon: House, label: "Overview", href:'/dashboard/user/overview'},
    {icon: Blender, label: "My Recipes",href:'/dashboard/user/my-recipe'},
    {icon: CgAdd, label: "Add Recipe",href:'/dashboard/user/add-recipe'},
    {icon: StarFill, label: "My Favourite",href:'/dashboard/user/fav'},
    {icon: ShoppingCart, label: "My Purchased Recipes",href:'/dashboard/user/purchased'},
    {icon: PersonGear, label: "Profile",href:'/dashboard/user/profile'},
  ];

  return (
    <>
    <div className="hidden md:block min-h-screen w-1/5 border-r">
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href || '#'}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"
          >
            <item.icon className="size-5 text-muted" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
    <Drawer>
      <Button variant="secondary" className={"md:hidden"}>
        <Bars />
        Menu
      </Button>
      <Drawer.Backdrop>
        <Drawer.Content placement="left">
          <Drawer.Dialog>
            <Drawer.CloseTrigger />
            <Drawer.Header>
              <Drawer.Heading>Navigation</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"
                    type="button"
                  >
                    <item.icon className="size-5 text-muted" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
    </>
  );
}