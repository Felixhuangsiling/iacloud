import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link} from "@nextui-org/react";
import {useLocation} from "react-router";

export default function Header(){
    const location = useLocation()
    return (
        <Navbar>
            <NavbarBrand>
                <img className="h-8 w-8" src="/src/assets/logo.png" alt='logo'/>
                <p className="font-bold text-inherit">Vegety</p>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem isActive={location.pathname === "/fruit-freshness"}>
                    <Link color={location.pathname === "/fruit-freshness" ? 'primary' : "foreground"} href="/fruit-freshness">
                        Prédiction de fraicheur
                    </Link>
                </NavbarItem>
                <NavbarItem isActive={location.pathname === "/crop-watter-req"}>
                    <Link color={location.pathname === "/crop-watter-req" ? 'primary' : "foreground"} href="/crop-watter-req">
                        Prédiction de besoin en eau
                    </Link>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    )
}
