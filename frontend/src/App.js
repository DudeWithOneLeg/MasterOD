import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SearchBar from "./components/SearchBar";
import Results from "./components/Results";
import SideBar from "./components/SideBar";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      {/* <div class="w-1/4 h-full bg-gray-200 overflow-hidden">

      </div> */}
      <div className="h-screen w-screen flex">

        {/* <SideBar /> */}

          <SearchBar />
      </div>
      {/* <div class="flex h-screen">
    <div class="flex-1 h-full bg-white overflow-auto">
        <div class="max-h-full p-4">
            <p class="overflow-y-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tempor leo vel nisi tincidunt, sit amet venenatis nisi pharetra. Donec in tortor eget massa viverra euismod eget eu felis. Quisque viverra auctor leo, vel bibendum ligula auctor a. In hac habitasse platea dictumst. Nulla facilisi. Duis in quam vitae ipsum pharetra dictum. Sed tempus libero in urna dignissim tincidunt. Ut vitae lectus tincidunt, convallis nulla nec, accumsan lacus. Integer id ultrices leo.</p>
            <p class="overflow-y-auto">Etiam efficitur nec risus at egestas. Integer fringilla fermentum augue, et tristique magna vulputate sit amet. Mauris vitae eros eu turpis bibendum lacinia. Integer at dui ut nunc vehicula tincidunt. Mauris aliquam est ac elit varius rhoncus. Cras mattis arcu non nisl convallis, nec laoreet orci eleifend. Proin pharetra convallis magna, sit amet tincidunt nunc ullamcorper id. Pellentesque sed</p>

            <p class="overflow-y-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tempor leo vel nisi tincidunt, sit amet venenatis nisi pharetra. Donec in tortor eget massa viverra euismod eget eu felis. Quisque viverra auctor leo, vel bibendum ligula auctor a. In hac habitasse platea dictumst. Nulla facilisi. Duis in quam vitae ipsum pharetra dictum. Sed tempus libero in urna dignissim tincidunt. Ut vitae lectus tincidunt, convallis nulla nec, accumsan lacus. Integer id ultrices leo.</p>
            <p class="overflow-y-auto">Etiam efficitur nec risus at egestas. Integer fringilla fermentum augue, et tristique magna vulputate sit amet. Mauris vitae eros eu turpis bibendum lacinia. Integer at dui ut nunc vehicula tincidunt. Mauris aliquam est ac elit varius rhoncus. Cras mattis arcu non nisl convallis, nec laoreet orci eleifend. Proin pharetra convallis magna, sit amet tincidunt nunc ullamcorper id. Pellentesque sed</p>

            <p class="overflow-y-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tempor leo vel nisi tincidunt, sit amet venenatis nisi pharetra. Donec in tortor eget massa viverra euismod eget eu felis. Quisque viverra auctor leo, vel bibendum ligula auctor a. In hac habitasse platea dictumst. Nulla facilisi. Duis in quam vitae ipsum pharetra dictum. Sed tempus libero in urna dignissim tincidunt. Ut vitae lectus tincidunt, convallis nulla nec, accumsan lacus. Integer id ultrices leo.</p>
            <p class="overflow-y-auto">Etiam efficitur nec risus at egestas. Integer fringilla fermentum augue, et tristique magna vulputate sit amet. Mauris vitae eros eu turpis bibendum lacinia. Integer at dui ut nunc vehicula tincidunt. Mauris aliquam est ac elit varius rhoncus. Cras mattis arcu non nisl convallis, nec laoreet orci eleifend. Proin pharetra convallis magna, sit amet tincidunt nunc ullamcorper id. Pellentesque sed</p>

        </div>
    </div>
</div> */}
      {isLoaded && (
        <Switch>
          <Route path="/login">
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
