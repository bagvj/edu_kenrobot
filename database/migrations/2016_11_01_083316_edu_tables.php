<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class EduTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->increments('id');
            $table->string('project_name', 200)->comment('项目名称');
            $table->integer('user_id')->comment('用户id');
            $table->integer('uid')->comment('主账号系统用户uid');
            $table->string('project_intro', 2000)->comment('项目介绍');
            $table->string('author', 200)->comment("作者");

            //执行好要改为varbinay
            $table->string('project_data',8000)->comment('项目数据');
            $table->integer('public_type')->comment('公开类型 0:私有 1:好友可见 2:完全公开');
            $table->string('hash', 20)->unique('hash')->comment('项目HASH');
            $table->string('imageHash', 20)->comment('项目图片hash');

            $table->timestamps();
            $table->softDeletes();
        });

        DB::statement("ALTER TABLE projects MODIFY COLUMN project_data mediumblob");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop("projects");
    }
}
