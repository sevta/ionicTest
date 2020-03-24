       <Route
                exact={true}
                path="/"
                render={() => {
                  console.log("Harusnya redirect disini, kok gagal?", auth);

                  if (auth) {
                    return <Redirect to="/app/home" />;
                  } else {
                    return <Redirect to="/signin" />;
                  }
                }}
              />