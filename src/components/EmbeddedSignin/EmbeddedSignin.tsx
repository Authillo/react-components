import React, { useEffect } from "react";

interface EmbeddedSigninProps {
  expectedOrigin?: string;
  callback: (code: string) => Promise<void>;
  codeChallenge: string;
  clientId: string;
  redirectUrl: string;
  state?: string;
  maxAge?: string;
}

const EmbeddedSignin = (props: EmbeddedSigninProps) => {
  const expectedOrigin = props?.expectedOrigin ?? "https://authillo.com";

  useEffect(() => {
    window.addEventListener("message", async (event) => {
      if (event.origin !== expectedOrigin) {
        console.error("invalid origin");
        return;
      }
      const code = event.data;
      const callCallback = async () => {
        await props?.callback(code);
      };
      callCallback();
    });
  }, [props, expectedOrigin]);

  if (props.codeChallenge === "" || props.codeChallenge == null) {
    return (
      <div>
        <h3>loading...</h3>
      </div>
    );
  }
  return (
    <iframe
      src={`${expectedOrigin}/iframe/embedsignin?response_type=code&scope=openid&state=${
        props?.state ?? "undefined"
      }&redirect_uri=${props.redirectUrl}&client_id=${props.clientId}&max_age=${
        props?.maxAge ?? "3600"
      }&code_challenge=${props.codeChallenge}&code_challenge_method=S256`}
      height="50"
      width="350"
      style={{ border: "none", borderRadius: "25px" }}
      title="Authillo sign in"
    >
      iframe sign in
    </iframe>
  );
};

export default EmbeddedSignin;
