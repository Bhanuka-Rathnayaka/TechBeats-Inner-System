package com.bitproject.techbeats.configuration;

import jakarta.servlet.DispatcherType;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.firewall.DefaultHttpFirewall;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class WebCofige {

    String UPLOAD_DIRECTORY = System.getProperty("user.dir") + "/item_photo/storage_Photo/**";
    @Bean//this call securityFilterChain function in web security automatically
    public SecurityFilterChain securityFilterChain(HttpSecurity http)throws Exception{
        http.csrf().disable().
                formLogin().
                loginPage("/login").//this is login page url we can replace "/login" from "login.html"
                usernameParameter("user_name").//this is get from user model(that in purple color)
                passwordParameter("password").//this is get from user model(that in purple color)
                defaultSuccessUrl("/dashboard",true).//login successfully url
                failureUrl("/login?error=usernamepassworderror").and().httpBasic().and()
                        .authorizeHttpRequests((request) ->
                        {request.dispatcherTypeMatchers(DispatcherType.FORWARD).permitAll()
                                .requestMatchers("/*.jpg").permitAll()
                                .requestMatchers("/Resourse/**").permitAll().
                                requestMatchers("/css/**").permitAll().
                                requestMatchers("/img/**").permitAll().
                                requestMatchers("/js/**").permitAll().
                                requestMatchers("/login").permitAll().
                                requestMatchers("/accessdenied").permitAll().
                                requestMatchers("/vendor").permitAll().
                                requestMatchers("/createadmin").permitAll().
                                requestMatchers("/employee/**").hasAnyAuthority("Admin","Manager","Assistant Manager","Owner","Cashier").
                                requestMatchers("/user/**").hasAnyAuthority("Admin","Manager","Owner","Cashier").
                                requestMatchers("/privilage/**").hasAnyAuthority("Admin","Manager","Owner","Cashier").
                                requestMatchers("/dashboard").hasAnyAuthority("Admin","Manager","Assistant Manager","Owner","Cashier").
                                requestMatchers("/customer/**").hasAnyAuthority("Admin","Manager","Owner","Cashier").
                                requestMatchers("/cooler/**").hasAnyAuthority("Admin","Manager","Assistant Manager","Owner","Cashier").
                                anyRequest().authenticated();



                        }).//any request of above get authenticated
                logout().
                logoutRequestMatcher(new AntPathRequestMatcher("/logout")).
                logoutSuccessUrl("/login").and().
                exceptionHandling().accessDeniedPage("/accessdenied");//if error occur redirect 404 page


        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder(){
        return new BCryptPasswordEncoder();
    }


    @Bean
    public HttpFirewall httpFirewall(){
        return new DefaultHttpFirewall();
    }

}

