export const baseUrl = "https://platform.dev.simpplr.xyz/v1/b2b/identity";

export const headers = {
  Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
  "Content-Type": "application/json",
  Accept: "application/json",
};

export let variable = "kartik";
export const sharedState = {
    variable: "kartik",
  };