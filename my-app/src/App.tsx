import React, {useEffect} from 'react';
import './App.css';
import axios from "axios";

function App() {
    useEffect(()=>{
        axios.get("http://laravel.vpd121.com/api/category")
            .then(resp=> {
                console.log("Server result", resp.data);
            });
        console.log("Use effect working");
    },[]);

    return (
        <>
            <h1 className="text-center">Категорії</h1>
            <div className="container">
                <table className="table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Назва</th>
                        <th>Фото</th>
                        <th>Опис</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>1</td>
                        <td>Сало</td>
                        <td>1.jpg</td>
                        <td>Козак</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default App;
