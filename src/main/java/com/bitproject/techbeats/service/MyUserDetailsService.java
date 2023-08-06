package com.bitproject.techbeats.service;


import com.bitproject.techbeats.user.Roles;
import com.bitproject.techbeats.user.User;
import com.bitproject.techbeats.user.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired//crete interface instance
    private UserRepository userDao;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {//this username get webconfig usernameparemeter

        User logeduser = userDao.findUserByUsername(username);


        if(logeduser != null){//if user exist
            Set<GrantedAuthority> userGrantSet = new HashSet<>();

            for (Roles role : logeduser.getRoles()){
                userGrantSet.add(new SimpleGrantedAuthority(role.getName()));
            }

            List<GrantedAuthority> authorities = new ArrayList<>(userGrantSet);

            return new org.springframework.security.core.userdetails.User(logeduser.getUser_name(),logeduser.getPassword(),logeduser.getStatus(),true,true,true,authorities);
        }else{//if user not exist
            List<GrantedAuthority> authorities = new ArrayList<>();
           return new org.springframework.security.core.userdetails.User("none","none",false,true,true,true,authorities);
        }

    }
}
