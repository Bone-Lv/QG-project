package com.gdut;

import com.gdut.controller.AdminUI;
import com.gdut.controller.LoginUI;
import com.gdut.controller.StudentUI;
import com.gdut.pojo.Admin;
import com.gdut.pojo.Student;
import com.gdut.pojo.User;
import com.gdut.service.UserService;
import com.gdut.service.impl.UserServiceImpl;

import java.util.Scanner;

public class Main {

    static void main() {
        // 创建同一个 UserService 实例
        UserService userService = new UserServiceImpl();

        //进入登录页面
        LoginUI loginUI = new LoginUI(userService);

        while(loginUI.showLoginMenu()){
        }

        //获取当前用户
        User user = userService.getCurrentUser();
        System.out.println("当前用户：" + user.getId());

        if(user.getRole().equals("学生")){
            StudentUI studentUI = new StudentUI(user);
            studentUI.showStudentMenu();
        }else{
            AdminUI adminUI = new AdminUI(user);
            adminUI.showAdminMenu();
        }

    }




}

