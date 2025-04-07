'use client';
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub } from "react-icons/fa";
import { MdLightMode } from "react-icons/md";
import { Search } from './ui/ Search';


const Header = (
    { theme, setTheme }: {
        theme: boolean;
        setTheme: (theme: boolean) => void;
    }
) => {
    const handelSwitchMode = () => {
        setTheme(!theme);
    }

    return (
        <div className={`${theme ? "text-black" : "text-white"} flex justify-between items-center w-full`}>
            <div className='flex justify-start items-center w-1/2'>
                <Link href="https://ui.shadcn.com/" target='_blank' className='flex items-center p-4 w-[15%] gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                        <rect width="256" height="256" fill="none" />
                        <line
                            x1="208"
                            y1="128"
                            x2="128"
                            y2="208"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="32"
                        />
                        <line
                            x1="192"
                            y1="40"
                            x2="40"
                            y2="192"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="32"
                        />
                    </svg>
                    <h1 className="text-xl">
                        Shadcn/ui
                    </h1>
                </Link>
                <div className='flex items-center p-4 ml-12 justify-start'>
                    <ul className='flex gap-4'>
                        <li>
                            <Link target="_blank" href="https://shadcn-editor.vercel.app/docs">Docs</Link>
                        </li>
                        <li>
                            <Link href="https://shadcn-editor.vercel.app/docs/plugins">Plugins</Link>
                        </li>
                        <li>
                            <Link href="/https://shadcn-editor.vercel.app/blocks">Blocks</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className='flex justify-end items-center w-1/2'>
                <Search />
                <div className='flex items-center p-4 ml-12 justify-end gap-4'>
                    <Link href="https://github.com/AmalLAGMIRI/shadcn" target="_blank" rel="noopener noreferrer">
                        <FaGithub />
                    </Link>
                    <MdLightMode onClick={handelSwitchMode} />
                </div>
            </div>
        </div>
    )
}

export default Header;

