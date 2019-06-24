import UserStore from '../class/UserStore/UserStore.class';

const Mutation = {
  login(parent, args) {
    return UserStore.login(args.arg);
  },
  register(parent, args) {
    return UserStore.register(args.arg);
  },
};

export { Mutation as default };
