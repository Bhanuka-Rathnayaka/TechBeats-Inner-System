package com.bitproject.techbeats;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;



@SpringBootApplication
public class TechbeatsApplication {


	public static void main(String[] args) {

		SpringApplication.run(TechbeatsApplication.class, args);
		System.out.println("hello word");
	}


//	@RequestMapping(value = "/",method = RequestMethod.GET)
//	public ModelAndView welcome(){
//		ModelAndView dashboardUI = new ModelAndView();
//		dashboardUI.setViewName("index.html");
//		return dashboardUI;
//	}



}
