<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Intervention\Image\Facades\Image;
use Validator;

class CategoryController extends Controller
{
    /**
     * @OA\Get(
     *     tags={"Category"},
     *     path="/api/category",
     *     @OA\Response(response="200", description="List Categories.")
     * )
     */
    public function index() {
        $list = Category::all();
        return response()->json($list, 200,
        ["Content-Type"=>"application/json;charset=UTF-8", "Charset" => "utf-8"], JSON_UNESCAPED_UNICODE);
    }

    /**
     * @OA\Post(
     *     tags={"Category"},
     *     path="/api/category",
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={},
     *                 @OA\Property(
     *                     property="image",
     *                     type="file"
     *                 ),
     *                 @OA\Property(
     *                     property="name",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="description",
     *                     type="string"
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(response="200", description="Add Category.")
     * )
     */
    public function create(Request $request) {
        $input = $request->all(); //Отримав значення усіх полів, які прийшли від клієнта
        $message = array(
            'name.required'=>'Вкажіть назву категорії',
            'image.required'=>'Вкажіть фото категорії',
            'description.required'=>'Вкажіть опис категорії',
        );
        $validation = Validator::make($input, [
            'name'=>'required',
            'image'=>'required',
            'description'=>'required',
        ], $message);

        if($validation->fails()) {
            return response()->json($validation->errors(), 400,
                ["Content-Type"=>"application/json;charset=UTF-8", "Charset" => "utf-8"], JSON_UNESCAPED_UNICODE);
        }
        if($request->hasFile('image')) {
            $image = $request->file('image');
            $filename = uniqid().'.'.$image->getClientOriginalExtension();
            $sizes = [50, 150, 300, 600, 1200];
            foreach ($sizes as $size) {
                $fileSave = $size.'_'.$filename;
                $resizeImage = Image::make($image)->resize($size, null, function($contraint){
                    $contraint->aspectRatio();
                })->encode();
                $path = public_path("uploads/".$fileSave);
                file_put_contents($path, $resizeImage);
            }
            $input['image']=$filename;
        }

        $category = Category::create($input);
        return response()->json($category, 201,
            ["Content-Type"=>"application/json;charset=UTF-8", "Charset" => "utf-8"], JSON_UNESCAPED_UNICODE);
    }

    /**
     * @OA\Get(
     *     tags={"Category"},
     *     path="/api/category/{id}",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Ідентифікатор категорії",
     *         required=true,
     *         @OA\Schema(
     *             type="number",
     *             format="int64"
     *         )
     *     ),
     *   security={{ "bearerAuth": {} }},
     *     @OA\Response(response="200", description="List Categories."),
     * @OA\Response(
     *    response=404,
     *    description="Wrong id",
     *    @OA\JsonContent(
     *       @OA\Property(property="message", type="string", example="Sorry, wrong Category Id has been sent. Pls try another one.")
     *        )
     *     )
     * )
     */
    public function getById($id) {
        $category = Category::findOrFail($id);
        return response()->json($category, 200,
            ["Content-Type"=>"application/json;charset=UTF-8", "Charset" => "utf-8"], JSON_UNESCAPED_UNICODE);
    }

    /**
     * @OA\Post(
     *     tags={"Category"},
     *     path="/api/category/edit/{id}",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Ідентифікатор категорії",
     *         required=true,
     *         @OA\Schema(
     *             type="number",
     *             format="int64"
     *         )
     *     ),
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"name"},
     *                 @OA\Property(
     *                     property="image",
     *                     type="file"
     *                 ),
     *                 @OA\Property(
     *                     property="name",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="description",
     *                     type="string"
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(response="200", description="Add Category.")
     * )
     */
    public function edit($id, Request $request) {
        $category = Category::findOrFail($id); //по id - отримав категорію, яку треба мінять
        $input = $request->all(); //Отримав значення усіх полів, які прийшли від клієнта
        $message = array(
          'name.required'=>'Вкажіть назву категорії',
          'description.required'=>'Вкажіть опис категорії',
        );
        $validation = Validator::make($input, [
            'name'=>'required',
            'description'=>'required',
        ], $message);

        if($validation->fails()) {
            return response()->json($validation->errors(), 400,
                ["Content-Type"=>"application/json;charset=UTF-8", "Charset" => "utf-8"], JSON_UNESCAPED_UNICODE);
        }

        if($request->hasFile('image')) {
            $image = $request->file('image');
            $filename = uniqid().'.'.$image->getClientOriginalExtension();
            $sizes = [50, 150, 300, 600, 1200];
            //видаляю старі фото
            foreach ($sizes as $size) {
                $fileDelete = $size.'_'.$category->image; //бере фото, яке в БД
                $removeImage = public_path('upload/'.$fileDelete);
                if(file_exists($removeImage))
                    unlink($removeImage);
            }
            foreach ($sizes as $size) {
                $fileSave = $size.'_'.$filename;
                $resizeImage = Image::make($image)->resize($size, null, function($contraint){
                    $contraint->aspectRatio();
                })->encode();
                $path = public_path("uploads/".$fileSave);
                file_put_contents($path, $resizeImage);
            }
            $input['image']=$filename;
        }
        else {
            $input['image']=$category->image; //якщо фото не передали, то буде стара фотка
        }

        $category->update($input);
        return response()->json($category, 200,
            ["Content-Type"=>"application/json;charset=UTF-8", "Charset" => "utf-8"], JSON_UNESCAPED_UNICODE);
    }

    /**
     * @OA\Delete(
     *     path="/api/category/{id}",
     *     tags={"Category"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Ідентифікатор категорії",
     *         required=true,
     *         @OA\Schema(
     *             type="number",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Успішне видалення категорії"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Категорії не знайдено"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Не авторизований"
     *     )
     * )
     */
    public function delete($id) {
        $category = Category::findOrFail($id);
        $category->delete();
        return response()->json("Delete complete", 200,
            ["Content-Type"=>"application/json;charset=UTF-8", "Charset" => "utf-8"], JSON_UNESCAPED_UNICODE);
    }
}
