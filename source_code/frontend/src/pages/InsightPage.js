("use client");
import React, { useState, useEffect, useRef, useCallback } from "react";
import Header from "../reusable/Header";
import Footer from "../reusable/Footer";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import * as topojson from "topojson-client";
import countries from "../assets/countries-50m.json";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "../components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Pie,
  PieChart,
  LabelList,
  YAxis,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import {
  CardContent,
  CardFooter,
  Card,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "../components/ui/select";

const coordinates = {
  "Boston, USA": [-71.0589, 42.3601],
  "Karachi, Pakistan": [67.0011, 24.8607],
  "Lahore, Pakistan": [74.3587, 31.5497],
  "Mumbai, India": [72.8777, 19.076],
  "New York, USA": [-73.935242, 40.73061],
};

function Insights() {
  const [userDetails, setUserDetails] = useState(null);
  const [postDetails, setPostDetails] = useState([]);
  const [viewerDetails, setViewerDetails] = useState({});
  const [tabs2, setTabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const viewers = useRef({});
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    // Convert TopoJSON to GeoJSON
    const geoJson = topojson.feature(countries, countries.objects.countries);
    setGeoData(geoJson);
  }, []);

  const fetchUserDetail = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5232/api/Account/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseBody = await response.json();
      console.log(responseBody);
      setUserDetails(responseBody);

      const postResponse = await fetch(
        `http://localhost:5232/api/posts/editor/${responseBody.userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!postResponse.ok) {
        throw new Error("Network response was not ok");
      }

      const postResponseBody = await postResponse.json();
      setPostDetails(postResponseBody.$values);

      console.log("posts", postDetails);

      const mappedTabs = postResponseBody.$values.map((postDetails) => ({
        id: postDetails.postId,
        label: postDetails.title,
        views: postDetails.numViews,
        avgRating: postDetails.avgRating,
        comments: postDetails.numComments,
      }));

      setTabs(mappedTabs);
      console.log("tabs are", mappedTabs);

      const viewersPromises = postResponseBody.$values.map(async (post) => {
        console.log("Fetching data for post ID:", post.postId);

        const fetchChartData = async (url) => {
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          return await response.json();
        };

        const [
          genderView,
          ageView,
          genderComment,
          ageComment,
          genderRating,
          ageRating,
          views,
        ] = await Promise.all([
          fetchChartData(
            `http://localhost:5232/api/views/post/${post.postId}/gender`
          ),
          fetchChartData(
            `http://localhost:5232/api/views/post/${post.postId}/age-groups`
          ),
          fetchChartData(
            `http://localhost:5232/api/comments/post/${post.postId}/gender`
          ),
          fetchChartData(
            `http://localhost:5232/api/comments/post/${post.postId}/age-groups`
          ),
          fetchChartData(
            `http://localhost:5232/api/ratings/post/${post.postId}/gender`
          ),
          fetchChartData(
            `http://localhost:5232/api/ratings/post/${post.postId}/age-groups`
          ),
          fetchChartData(
            `http://localhost:5232/api/views/post/${post.postId}/viewers`
          ),
        ]);

        const formatData = (data) =>
          Object.entries(data)
            .filter(([key]) => key !== "$id")
            .map(([key, count]) => ({
              key,
              count,
            }));

        return {
          postId: post.postId,
          data: {
            genderView: formatData(genderView),
            ageView: formatData(ageView),
            genderComment: formatData(genderComment),
            ageComment: formatData(ageComment),
            genderRating: formatData(genderRating),
            ageRating: formatData(ageRating),
            viewers: views,
          },
        };
      });

      const viewersArray = await Promise.all(viewersPromises);

      const viewersMap = viewersArray.reduce((acc, { postId, data }) => {
        acc[postId] = data;
        return acc;
      }, {});

      viewers.current = viewersMap;

      setViewerDetails(viewersMap);

      console.log("map", viewersMap);
      console.log("global", viewers.current);
      console.log("global state", viewerDetails);
    } catch (error) {
      console.error("Error getting details:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  }, [viewerDetails]);

  useEffect(() => {
    fetchUserDetail();
  }, []);

  const getDataForTab = (tabId, dataType) => {
    if (loading) return [];
    if (dataType === "viewers") {
      return viewers.current[tabId][dataType].$values || [];
    } else {
      return viewers.current[tabId][dataType] || [];
    }
    return [];
  };

  if (loading || !geoData) {
    return (
      <div className="overflow-x-hidden flex flex-col">
        <Header />
        <div className="main mt-[10vh] ml-[6vw] w-screen h-[70vh] flex items-center justify-center">
          <div className="text-center text-3xl text-text">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (postDetails.length === 0) {
    return (
      <div className="overflow-x-hidden flex flex-col">
        <Header />
        <div className="main mt-[10vh] ml-[6vw] w-screen h-[70vh]">
          <div className="text-center text-3xl text-text">No posts found.</div>
        </div>
        <Footer></Footer>
      </div>
    );
  }

  const formatAndAggregateData = (data) => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const options = {
        day: "numeric",
        month: "long",
      };

      const day = date.toLocaleDateString("en-US", { day: "numeric" });
      let daySuffix;

      if (day.endsWith("1") && day !== "11") {
        daySuffix = "st";
      } else if (day.endsWith("2") && day !== "12") {
        daySuffix = "nd";
      } else if (day.endsWith("3") && day !== "13") {
        daySuffix = "rd";
      } else {
        daySuffix = "th";
      }

      return `${date.toLocaleDateString("en-US", options)}${daySuffix}`;
    };

    const formattedData = data.map((view) => ({
      createdAt: formatDate(view.createdAt),
      viewCount: 1,
    }));

    return formattedData.reduce((acc, curr) => {
      const existingEntry = acc.find(
        (entry) => entry.createdAt === curr.createdAt
      );
      if (existingEntry) {
        existingEntry.viewCount += 1;
      } else {
        acc.push({ createdAt: curr.createdAt, viewCount: 1 });
      }
      return acc;
    }, []);
  };

  return (
    <div className="flex flex-col overflow-x-hidden">
      <Header />
      <div className="main mt-[10vh] flex w-screen justify-center">
        <Tabs
          defaultValue={tabs2.length > 0 ? tabs2[0].id : ""}
          className="w-[90%]"
        >
          <TabsList className="absolute text-left w-[10vw] rounded-xlg right-[10vw] top-[25vh] bg-secondary">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="My Posts" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectGroup className="flex flex-col">
                  <SelectLabel>My Posts</SelectLabel>
                  {tabs2.map((tab) => (
                    <TabsTrigger key={tab.id} value={tab.id}>
                      <SelectItem value={tab.id}>{tab.label}</SelectItem>
                    </TabsTrigger>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </TabsList>

          {tabs2.map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className="flex flex-col gap-[5vh]"
            >
              <h2 className="font-bold text-xlg pb-[5vh]">
                Get insights on your post <i>{tab.label}</i>
              </h2>
              <div className="stats flex flex-row gap-20 justify-center">
                <Card className="w-[10vw] h-[15vh] flex flex-col justify-content shadow shadow-lg items-center bg-white dark:bg-background">
                  <CardContent className="text-center text-text p-0 text-xlg">
                    {tab.views}
                  </CardContent>
                  <CardFooter className="text-xsm">views</CardFooter>
                </Card>
                <Card className="w-[10vw] h-[15vh] flex flex-col justify-content shadow items-center shadow-lg bg-white dark:bg-background">
                  <CardContent className="text-center text-text p-0 text-xlg">
                    {tab.comments}
                  </CardContent>
                  <CardFooter className="text-xsm">comments</CardFooter>
                </Card>
                <Card className="w-[8vw] h-[15vh] flex flex-col justify-content shadow items-center  shadow-lg bg-white dark:bg-background">
                  <CardContent className="text-center text-text p-0 text-xlg">
                    {tab.avgRating}
                  </CardContent>
                  <CardFooter className="text-xsm">avg. rating</CardFooter>
                </Card>
              </div>

              <Card className="shadow items-center w-full flex flex-col pt-2 gap-2 justify-center shadow-lg bg-white dark:bg-background">
                <ChartContainer
                  config={chartConfig}
                  className="min-h-[150px] h-[20vh] w-[80%] dark:bg-background"
                >
                  <LineChart
                    width={200}
                    height={150}
                    data={formatAndAggregateData(
                      getDataForTab(tab.id, "viewers")
                    )}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="createdAt" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="viewCount"
                      stroke="#69ab7e"
                    />
                  </LineChart>
                </ChartContainer>
                <CardFooter className="text-sm">Views Over Time</CardFooter>
              </Card>

              <div className="grid md:grid-cols-3 grid-cols-1 md:gap-10 gap-5">
                <Card className="shadow items-center flex flex-col pt-2 gap-2 justify-center shadow-lg bg-white dark:bg-background">
                  <ChartContainer
                    config={chartConfig}
                    className="min-h-[150px] h-[70%] w-[100%] pt-3 pr-[10%]"
                  >
                    <BarChart data={getDataForTab(tab.id, "genderView")}>
                      <CartesianGrid />
                      <XAxis
                        dataKey="key"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        label={{
                          value: "Views",
                          angle: -90,
                          offset: 30,
                        }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="#69ab7e" radius={4} />
                    </BarChart>
                  </ChartContainer>
                  <CardFooter className="text-sm">Views by Gender</CardFooter>
                </Card>

                {/* Age View Chart */}
                <Card className="shadow flex flex-col pt-2 items-center justify-center shadow-lg bg-white dark:bg-background">
                  <ChartContainer
                    config={chartConfig}
                    className="min-h-[150px] h-[70%] w-[100%] pr-[10%]"
                  >
                    <BarChart data={getDataForTab(tab.id, "ageView")}>
                      <CartesianGrid />
                      <XAxis
                        dataKey="key"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        // label={{
                        //   value: "Age Group",
                        //   offset: 30,
                        //   posiition: "insideBottom",
                        // }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        type="number"
                        label={{
                          value: "Views",
                          angle: -90,
                          offset: 30,
                        }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      {/* <Legend height={36} /> */}
                      <Bar dataKey="count" fill="#5e8260" radius={4} />
                    </BarChart>
                  </ChartContainer>
                  <CardFooter className="text-sm">Views by Age</CardFooter>
                </Card>
                <Card className="shadow items-center flex flex-col pt-2 gap-2 justify-center shadow-lg bg-white dark:bg-background">
                  <ChartContainer
                    config={chartConfig}
                    className="min-h-[120px] h-[70%] w-[80%]"
                  >
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <CartesianGrid />
                      <Pie
                        data={getDataForTab(tab.id, "genderComment")}
                        dataKey="count"
                        nameKey="key"
                        innerRadius={40}
                        outerRadius={60}
                        strokeWidth={3}
                        fill="#69ab7e"
                      >
                        {getDataForTab(tab.id, "genderComment").map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                entry.key === "male" ? "#5e8260" : "#69ab7e"
                              }
                            />
                          )
                        )}
                        <LabelList
                          dataKey="count"
                          className="fill-background"
                          stroke="none"
                          fontSize={12}
                        />
                      </Pie>

                      <Legend
                        height={36}
                        align="right"
                        layout="vertical"
                        verticalAlign="right"
                        iconType="circle"
                        wrapperStyle={{ marginRight: -20, marginTop: 20 }}
                      />
                    </PieChart>
                  </ChartContainer>
                  <CardFooter className="text-sm">
                    Comments by Gender
                  </CardFooter>
                </Card>

                {/* Age Comment Chart */}
                <Card className="shadow items-center flex flex-col pt-2 gap-2 justify-center shadow-lg bg-white dark:bg-background">
                  <ChartContainer
                    config={chartConfig}
                    className="min-h-[120px] h-[70%] w-[85%] mt-2 mr-[10%]"
                  >
                    <BarChart
                      data={getDataForTab(tab.id, "ageComment")}
                      layout="vertical"
                      margin={{ left: -20 }}
                    >
                      <CartesianGrid />
                      <YAxis
                        dataKey="key"
                        type="category"
                        fontSize={9}
                        tickLine={false}
                        tickMargin={2}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 5)}
                      />
                      <XAxis
                        type="number"
                        dataKey="count"
                        tickLine={false}
                        axisLine={false}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="count"
                        fill="#5e8260"
                        radius={4}
                        barSize={40}
                      />
                    </BarChart>
                  </ChartContainer>
                  <CardFooter className="text-sm">Comments by Age</CardFooter>
                </Card>

                {/* Gender Rating Chart */}
                <Card className="shadow items-center flex flex-col gap-2 pt-2 justify-center shadow-lg bg-white dark:bg-background">
                  <ChartContainer
                    config={chartConfig}
                    className="min-h-[150px] h-[70%] w-[100%] mr-[10%]"
                  >
                    <BarChart data={getDataForTab(tab.id, "genderRating")}>
                      <CartesianGrid />
                      <XAxis
                        dataKey="key"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        type="number"
                        label={{
                          value: "Rating",
                          angle: -90,
                          offset: 30,
                        }}
                      />

                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="#69ab7e" radius={4} />
                    </BarChart>
                  </ChartContainer>
                  <CardFooter className="text-sm">
                    Avg. Rating by Gender
                  </CardFooter>
                </Card>

                {/* Age Rating Chart */}
                <Card className="shadow items-center flex flex-col gap-2 pt-2 justify-center shadow-lg bg-white dark:bg-background">
                  <ChartContainer
                    config={chartConfig}
                    className="min-h-[150px] h-[70%] w-[100%] mr-[10%]"
                  >
                    <BarChart data={getDataForTab(tab.id, "ageRating")}>
                      <CartesianGrid />
                      <XAxis
                        dataKey="key"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        type="number"
                        label={{
                          value: "Rating",
                          angle: -90,
                          offset: 30,
                        }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="#5e8260" radius={4} />
                    </BarChart>
                  </ChartContainer>
                  <CardFooter className="text-sm">
                    Avg. Rating by Age
                  </CardFooter>
                </Card>
              </div>

              <Card className="bg-white items-center dark:bg-background shadow w-[full] shadow-lg flex justify-center flex flex-col ">
                <ComposableMap className="h-[300px]">
                  <Geographies geography={geoData}>
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill="white"
                          stroke="black"
                        />
                      ))
                    }
                  </Geographies>
                  {getDataForTab(tab.id, "viewers").map(
                    ({ key, cityStateCountry }) => {
                      const coord = coordinates[cityStateCountry];
                      return (
                        coord && (
                          <Marker key={key} coordinates={coord}>
                            <circle cx="0" cy="0" r="10" fill="#5e8260" />
                          </Marker>
                        )
                      );
                    }
                  )}
                </ComposableMap>
                <CardFooter className="text-sm">Views by Location</CardFooter>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}

const chartConfig = {
  key: {
    male: "#5e8260",
    female: "#69ab7e",
  },
};

export default Insights;
