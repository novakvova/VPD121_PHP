import React, {useEffect, useState} from "react";
import {ICategoryItem} from "./types";
import http_common from "../../../http_common";
import {Link} from "react-router-dom";
import {APP_ENV} from "../../../env";

const CategoryListPage = () => {
    const [list, setList] = useState<ICategoryItem[]>([]);
    useEffect(() => {
        http_common.get<ICategoryItem[]>("api/category")
            .then(resp => {
                const {data} = resp;
                setList(data);
                //console.log("Server result", resp.data);
            });
        console.log("Use effect working");
    }, []);

    const listMap = list.map(item => {
        return (
            <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>
                    <img src={`${APP_ENV.BASE_URL}uploads/150_${item.image}`} width={150} alt={"фото"}/>
                </td>
                <td>{item.description}</td>
                <td>
                    <Link to={`/category/edit/${item.id}`} className={"btn btn-success"}>Змінити</Link>
                </td>
            </tr>
        );
    });

    return (
        <>
            <h1 className="text-center">Категорії</h1>
            <div className="container">
                <Link to={"/category/create"} className={"btn btn-success"}>Додати</Link>
                <table className="table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Назва</th>
                        <th>Фото</th>
                        <th>Опис</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {listMap}
                    </tbody>
                </table>
            </div>
        </>
    )
};

export default CategoryListPage;
