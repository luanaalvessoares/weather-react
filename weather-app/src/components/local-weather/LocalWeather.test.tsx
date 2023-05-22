import { render, screen } from "@testing-library/react";
import App from "./LocalWeather";

test("renders component with correct city name and temperature", () => {
  render(<App />);
  const cityNameElement = screen.getByText(/Cidade:/i);
  const temperatureElement = screen.getByText(/Temp\. Atual:/i);
  expect(cityNameElement).toBeInTheDocument();
  expect(temperatureElement).toBeInTheDocument();
});
