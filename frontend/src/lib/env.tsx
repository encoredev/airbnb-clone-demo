import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { Client, createClient, Provider } from "urql";

export interface EnvInfo {
  envName: string;
  setEnvName: (envName: string) => void;
}

const EnvContext = createContext<EnvInfo>({
  envName: "staging",
  setEnvName: (e) => {},
});

export const useEnv = () => {
  return useContext(EnvContext);
};

export const EnvProvider: FC<PropsWithChildren> = ({ children }) => {
  const [envName, setEnvName] = useState("staging");
  return (
    <EnvContext.Provider
      value={{
        envName,
        setEnvName,
      }}
    >
      {children}
    </EnvContext.Provider>
  );
};

export const EnvDropdown: FC = (props) => {
  const { envName, setEnvName } = useEnv();
  const [val, setVal] = useState(envName);

  const update = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEnvName(val);
  };

  return (
    <div className="text-gray-900">
      <form onSubmit={update}>
        <input
          type="string"
          name="env"
          id="env"
          className="block px-2 h-8 text-gray-800 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={val}
          onChange={(e) => setVal(e.currentTarget.value)}
        />
      </form>
    </div>
  );
};

export const GraphQLProvider: FC<PropsWithChildren> = ({ children }) => {
  const { envName } = useEnv();

  const baseURL =
    envName === "local"
      ? "http://localhost:4000"
      : `https://${envName.replace(":", "-")}-airbnb-mkg2.encr.app`;

  const client = createClient({
    url: baseURL + "/graphql",
  });

  return <Provider value={client}>{children}</Provider>;
};
