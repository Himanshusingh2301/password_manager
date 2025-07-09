/* eslint-disable no-unused-vars */
import React from 'react'
import { useRef, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
uuidv4();
const Manager = () => {
    const ref = useRef();
    const passref = useRef();
    const [form, setform] = useState({ site: '', username: '', password: '' });
    const [passwordArr, setpasswordArr] = useState([])

    const getpass = async () => {
        let req = await fetch("http://localhost:3000/");
        let passwords = await req.json();
        setpasswordArr(passwords);
        // passwords = localStorage.getItem('passwords');
        // console.log(passwords);
    }

    useEffect(() => {
        getpass();

    }, [])


    const show = () => {
        if (ref.current.src.includes('public/view.png')) {
            ref.current.src = 'public/hide.png';
            passref.current.type = "password"
        }
        else {
            ref.current.src = 'public/view.png';
            passref.current.type = "text";
        }
    }

    const savepass = async () => {

        if (form.site === '' || form.username === '' || form.password === '') {
            alert("Please fill all fields");
            return;
        }

        const newPass = { id: uuidv4(), site: form.site, username: form.username, password: form.password };
        // console.log(newPass)
        setpasswordArr([...passwordArr, newPass,]);

        await fetch('http://localhost:3000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPass),
        })
        // localStorage.setItem('passwords', JSON.stringify([...passwordArr, newPass]));
        setform({ site: '', username: '', password: '' });
        // console.log(passwordArr);
    }

    const handlechange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value });
        // console.log(form);

    }

    const copy = (item) => {

        return () => {
            navigator.clipboard.writeText(item);
            // console.log(item);
        }

    }

    const del = async (id) => {
        // console.log(id);
        const newArr = passwordArr.filter(item=> item.id !== id);
        // console.log(newArr)
        setpasswordArr(newArr);
        await fetch('http://localhost:3000/', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }),
        })
        // localStorage.setItem('passwords', JSON.stringify(newArr));

    }

    const edit = async(item, id) => {
        // console.log(item);
        setform(item);
        const newArr = passwordArr.filter(item => item.id !== id);
        setpasswordArr(newArr);
        await fetch('http://localhost:3000/', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }),
        })



    }

    return (
        <div className='flex flex-col  text-white mx-auto max-w-fit p-5 bg-emerald-950 rounded-lg shadow-md  items-center m-5'>
            <h1 className='text-2xl'>PASSOP</h1>
            <p>Welcome to the Password Manager</p>
            <div>
                <input value={form.site} name='site' onChange={handlechange} className='bg-amber-50 rounded-lg w-2xl my-5 text-black px-3 py-1' type="text" placeholder='enter url' required />

                <div className="flex w-full justify-between gap-6">

                    <input value={form.username} name='username' onChange={handlechange} className='rounded-lg bg-amber-50 text-black w-full px-3 py-1' type="text" placeholder='enter name' required />

                    <div className="relative">

                        <input ref={passref} value={form.password} name='password' onChange={handlechange} className='rounded-lg bg-amber-50 text-black w-full px-3 py-1' type="password" placeholder='enter password' required />

                        <span className='absolute right-0 top-1 cursor-pointer' onClick={show}>
                            <img ref={ref} className='p-1' src="public/hide.png" alt="view" width={25} />
                        </span>
                    </div>
                </div>
            </div>
            <button onClick={savepass} className='bg-blue-400 rounded-2xl p-1 text-[18px] px-3 mt-7 hover:cursor-pointer hover:bg-blue-900 transition-all duration-300'>Add Password</button>

            <div className='mt-10  w-full rounded-md overflow-hidden ' >
                <h1 className='text-2xl mb-2'>Your Passwords...</h1>

                {passwordArr.length === 0 && <p className='text-red-500'>No passwords saved yet</p>}

                {passwordArr.length !== 0 &&
                    <table className="table-auto w-full text-center">
                        <thead className='bg-cyan-950  '>
                            <tr>
                                <th>Site</th>
                                <th>Username</th>
                                <th>Password</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                passwordArr.map((item, index) => {
                                    return (
                                        <tr key={index} className='bg-cyan-800 w-full'>

                                            <td className=' px-4 py-1 '>
                                                <span className='flex items-center justify-between gap-4'>
                                                    <a href={item.site} target='_blank'>
                                                        {item.site}</a>
                                                    <span className='flex gap-2'>
                                                        <img className='cursor-pointer' onClick={copy(item.site)} src="public/copy.png" width={20} alt="" />

                                                    </span>
                                                </span>
                                            </td>
                                            <td className=' px-4 py-1 '>
                                                <span className='flex items-center justify-between gap-4'>
                                                    {item.username}
                                                    <span className='flex gap-2'>
                                                        <img className='cursor-pointer' onClick={copy(item.site)} src="public/copy.png" width={20} alt="" />
                                                    </span>
                                                </span>
                                            </td>
                                            <td className=' px-4 py-1 '>
                                                <span className='flex  justify-between '>
                                                    {"*".repeat(item.password.length)}
                                                    <span className='flex gap-2'>
                                                        <img className='cursor-pointer' onClick={copy(item.site)} src="public/copy.png" width={20} alt="" />
                                                        <img className='cursor-pointer' onClick={() => del(item.id)} src="public/delete.png" width={20} alt="" />
                                                        <img className='cursor-pointer' onClick={() => edit(item, item.id)} src="public/edit.png" width={20} alt="" />
                                                    </span>
                                                </span>
                                            </td>

                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>}

            </div>

        </div>
    )
}

export default Manager