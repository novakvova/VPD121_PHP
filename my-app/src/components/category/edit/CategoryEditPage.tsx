import {ICategoryEdit} from "./types";
import {useFormik} from "formik";
import http_common from "../../../http_common";
import {ICategoryItem} from "../list/types";
import {useNavigate, useParams} from "react-router-dom";
import defaultImage from "../../../assets/default.jpg";
import {ChangeEvent, useEffect, useState} from "react";
import {APP_ENV} from "../../../env";

const CategoryEditPage = () => {
    const {id} = useParams();
    //Фото, яке мав товар під час виводу на екран
    const [oldImage, setOldImage] = useState<string>("");

    const init : ICategoryEdit = {
        id: 0,
        name: "",
        image: null,
        description: ""
    };

    const navigate = useNavigate();
    const onFormikSubmit = async (values: ICategoryEdit) => {
        try {
            const result =
                await http_common.post<ICategoryItem>(`api/category/edit/${id}`, values, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            console.log("Add category is good", result.data);
            navigate("/");
        }
        catch {
            console.log("Add category error");
        }
    }

    const formik = useFormik({
        onSubmit: onFormikSubmit,
        initialValues: init
    });
    const {values, handleChange, handleSubmit, setFieldValue} = formik;

    useEffect(() => {
        http_common.get<ICategoryItem>(`api/category/${id}`)
            .then(resp => {
                //console.log("get category info", resp.data);
                setFieldValue("name", resp.data.name);
                setFieldValue("description", resp.data.description);
                setOldImage(`${APP_ENV.BASE_URL}/uploads/300_${resp.data.image}`);
            });
    },[id]);

    const onFileChangeHandler = (e:ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if(files) {
            const file = files[0];
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
            if(!allowedTypes.includes(file.type)) {
                alert("Не доступний формат файлу!");
                return;
            }
            setFieldValue(e.target.name, file);
        }
    }
    const imgView = oldImage ? oldImage : defaultImage;
    return (
        <>
            <div className="container">
                <h1 className="text-center">Зміна категорії</h1>
                <form className={"col-md-8 offset-md-2"} onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Назва</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name={"name"}
                            value={values.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="image">
                            <img src={values.image==null ? imgView : URL.createObjectURL(values.image)}
                                 width={200} alt="фото"
                                 style={{cursor: "pointer"}} />
                        </label>
                        <input
                            type="file"
                            className="d-none"
                            id="image"
                            name={"image"}
                            onChange={onFileChangeHandler}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Опис</label>
                        <input
                            type="text"
                            className="form-control"
                            id="description"
                            name={"description"}
                            value={values.description}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Зберегти</button>
                </form>
            </div>
        </>
    );
}

export default CategoryEditPage;
