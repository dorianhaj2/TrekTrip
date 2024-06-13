//package com.trektrip.controller;
////
////import com.trektrip.model.Location;
////import com.trektrip.service.LocationService;
////import lombok.AllArgsConstructor;
////import org.springframework.http.HttpStatus;
////import org.springframework.http.ResponseEntity;
////import org.springframework.web.bind.annotation.*;
////
////import java.util.List;
////import java.util.Optional;
////
////@RestController
////@RequestMapping("/location")
////@AllArgsConstructor
////
////public class LocationController {
////
////    private LocationService locationService;
////
////    @GetMapping("/all")
////    public ResponseEntity<List<Location>> getAllLocations() {
////       return ResponseEntity.ok(locationService.getLocations());
////
////    }
////
////    @GetMapping("/{id}")
////    public ResponseEntity<Location> getLocationById(@PathVariable Long id) {
////        Optional<Location> locationOptional =  locationService.getLocation(id);
////        if (locationOptional.isPresent()){
////            return ResponseEntity.ok(locationOptional.get());
////        } else {
////            return ResponseEntity.noContent().build();
////        }
////    }
////
////
////    @PostMapping
////    public ResponseEntity<Location> createLocation(@RequestBody Location location) {
////        return new ResponseEntity<>(locationService.createLocation(location), HttpStatus.CREATED);
////    }
////
////    @PutMapping("/{id}")
////    public ResponseEntity<Location> updateLocation(@RequestBody Location location, @PathVariable Long id) {
////        try {
////            Location updatedlocation = (Location) locationService.updateLocation(location, id);
////            return new ResponseEntity<>(updatedlocation, HttpStatus.OK);
////        } catch (Exception e) {
////            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
////        }
////
////    }
////
////    @DeleteMapping("/{id}")
////    public ResponseEntity<Void> deleteLocation(@PathVariable Long id) {
////        locationService.deleteLocation(id);
////        return ResponseEntity.noContent().build();
////    }
////}
////
////
////
//
//@WebMvcTest(controllers = UserController.class)
//@AutoConfigureMockMvc(addFilters = false)
//@ExtendWith(MockitoExtension.class)
//class UserControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockBean
//    private UserService userService;
//
//    @MockBean
//    private PasswordEncoder passwordEncoder;
//
//    @MockBean
//    private JwtService jwtService;
//    @MockBean
//    private UserDetailsServiceImpl userDetailsService;
//
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    private UserInfo user1;
//    private UserInfo user2;
//
//    @BeforeEach
//    public void init() {
//        user1 = new UserInfo(1L, "user1", "user1@mail.com", "pass1");
//        user2 = new UserInfo(2L, "user2", "user2@mail.com", "pass2");
//    }
//
//    @Test
//    public void testCreateUser() throws Exception {
//        given(userService.createUser(ArgumentMatchers.any())).willAnswer((invocationOnMock -> invocationOnMock.getArgument(0)));
//
//        ResultActions response = mockMvc.perform(post("/user/register")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(objectMapper.writeValueAsString(user1)));
//
//        response.andExpect(MockMvcResultMatchers.status().isCreated())
//                .andExpect(MockMvcResultMatchers.jsonPath("$.username", CoreMatchers.is(user1.getUsername())))
//                .andExpect(MockMvcResultMatchers.jsonPath("$.email", CoreMatchers.is(user1.getEmail())));
//    }
//
//    @Test
//    public void testGetAllUsers() throws Exception {
//        List<UserInfo> allUsers = List.of(user1, user2);
//        when(userService.getAllUsers()).thenReturn(allUsers);
//
//        ResultActions response = mockMvc.perform(get("/user/all")
//                .contentType(MediaType.APPLICATION_JSON));
//
//        response.andExpect(MockMvcResultMatchers.status().isOk())
//                .andExpect(MockMvcResultMatchers.jsonPath("$.size()", CoreMatchers.is(allUsers.size())));
//
//    }
//
//    @Test
//    @WithMockUser
//    public void testGetUserByIdExists() throws Exception {
//        Long id = 1L;
//        when(userService.getUserById(id)).thenReturn(Optional.of(user1));
//
//        ResultActions response = mockMvc.perform(get("/user/1")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(objectMapper.writeValueAsString(user1)));
//
//        response.andExpect(MockMvcResultMatchers.status().isOk())
//                .andExpect(MockMvcResultMatchers.jsonPath("$.username", CoreMatchers.is(user1.getUsername())))
//                .andExpect(MockMvcResultMatchers.jsonPath("$.email", CoreMatchers.is(user1.getEmail())));
//    }
//
//    @Test
//    @WithMockUser
//    public void testGetUserByIdDoesntExist() throws Exception {
//        Long id = 3L;
//        when(userService.getUserById(id)).thenReturn(Optional.empty());
//
//        ResultActions response = mockMvc.perform(get("/user/3")
//                .contentType(MediaType.APPLICATION_JSON));
//
//        response.andExpect(MockMvcResultMatchers.status().isNoContent());
//    }
//
//
//    @Test
//    @WithMockUser
//    public void testUpdateUser() throws Exception {
//        Long id = 1L;
//        when(userService.updateUser(user2, id)).thenReturn(user2);
//
//        ResultActions response = mockMvc.perform(put("/user/1")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(objectMapper.writeValueAsString(user2)));
//
//        response.andExpect(MockMvcResultMatchers.status().isOk())
//                .andExpect(MockMvcResultMatchers.jsonPath("$.username", CoreMatchers.is(user2.getUsername())))
//                .andExpect(MockMvcResultMatchers.jsonPath("$.email", CoreMatchers.is(user2.getEmail())));
//    }
//
//    @Test
//    @WithMockUser
//    public void testDeleteUser() throws Exception {
//        Long id = 1L;
//        doNothing().when(userService).deleteUser(id);
//
//        ResultActions response = mockMvc.perform(delete("/user/1")
//                .contentType(MediaType.APPLICATION_JSON));
//
//        response.andExpect(MockMvcResultMatchers.status().isNoContent());
//    }
//}