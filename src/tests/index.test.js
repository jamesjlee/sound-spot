import React from "react";
import { shallow } from "enzyme";
import Root from "../Root";


describe("index.js", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Root />);
  });

  it("should contain Root element", () => {
    expect(wrapper).toBeDefined();
  });
});
