"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
export function ThemeToggle(){const [theme,setTheme]=useState<"light"|"dark">("light");useEffect(()=>{const saved=localStorage.getItem("theme");const preferred=saved==="dark"||saved==="light"?saved:"light";setTheme(preferred);document.documentElement.dataset.theme=preferred;},[]);function toggle(){const next=theme==="light"?"dark":"light";setTheme(next);document.documentElement.dataset.theme=next;localStorage.setItem("theme",next);}return <button className="icon-button" onClick={toggle} aria-label={`Switch to ${theme==="light"?"dark":"light"} theme`} title="Toggle theme">{theme==="light"?<Moon size={18}/>:<Sun size={18}/>}</button>}
