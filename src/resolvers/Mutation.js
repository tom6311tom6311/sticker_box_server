import UserStore from '../class/UserStore/UserStore.class';

const Mutation = {
  login(parent, args) {
    return UserStore.login(args);
  },
};

export { Mutation as default };
