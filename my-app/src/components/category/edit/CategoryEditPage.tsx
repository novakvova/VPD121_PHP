import {ICategoryEdit} from "./types";
import {useFormik} from "formik";
import http_common from "../../../http_common";
import {ICategoryItem} from "../list/types";
import {useNavigate, useParams} from "react-router-dom";

const CategoryEditPage = () => {
    const {id} = useParams();
    console.log("Edit id ", id);
    const init : ICategoryEdit = {
        id: 0,
        name: "",
        image: "",
        description: ""
    };

    const navigate = useNavigate();
    const onFormikSubmit = async (values: ICategoryEdit) => {
        console.log("Edit category data", values);
    }

    const formik = useFormik({
        onSubmit: onFormikSubmit,
        initialValues: init
    });
    const {values, handleChange, handleSubmit} = formik;

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
                        <label htmlFor="image" className="form-label">Фото</label>
                        <input
                            type="text"
                            className="form-control"
                            id="image"
                            name={"image"}
                            value={values.image}
                            onChange={handleChange}
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