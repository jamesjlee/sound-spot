import { isLoggedIn } from "../actions/UserSessionActions";
const mapStateToUserProps = (state) => {
  //   return {
  //       user:
  //   }
};

const mapDispatchToUserProps = () => {
  isLoggedIn;
};

const PrivateRouteContainer = connect(
  mapStateToUserProps,
  mapDispatchToUserProps
)(User);

export default PrivateRouteContainer;
