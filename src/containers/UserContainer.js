import {
  login,
  logout,
  refreshUserSession
} from "../actions/UserSessionActions";
const mapStateToUserProps = (state) => {
//   return {
//       user:
//   }
};

const mapDispatchToUserProps = () => {
    login,
    logout,
    refreshUserSession
};

export default connect(
  mapStateToUserProps,
  mapDispatchToUserProps
)(User);
