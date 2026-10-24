// src/components/video-warning-modal.ts
  function createVideoSizeWarningModal(api) {
    const React = api.React;
    const el = React.createElement;
    const { Badge, Box, Button, HStack, Text, VStack } = api.ChakraUI;
    return function VideoSizeWarningModal(props) {
      const host = api.getHostContext();
      const t = useLocale(host);
      const theme = lteUseTheme(api);
      const file = _pendingVideo;
      return el(
        VStack,
        { align: "stretch", spacing: 4, style: theme.style },
        el(
          HStack,
          { spacing: 2, align: "center" },
          el(Badge, { colorScheme: "orange", variant: "solid", borderRadius: "full", fontSize: "xs", px: 2 }, "VIDEO"),
          el(Text, { fontSize: "sm", fontWeight: "bold" }, file ? file.name : "")
        ),
        el(Text, { fontSize: "sm", lineHeight: 1.6 }, t("videoLargeWarning")),
        el(
          Box,
          {
            p: 2,
            borderRadius: "md",
            bg: "var(--lte-inner)",
            border: "1px solid var(--lte-border)"
          },
          el(
            Text,
            { fontSize: "xs", color: "var(--lte-text-muted)" },
            t("videoLargeSize") + ": " + formatVideoSize(file ? file.size : 0)
          )
        ),
        el(
          HStack,
          { spacing: 2, justify: "flex-end" },
          el(
            Button,
            {
              size: "sm",
              variant: "outline",
              onClick: function() {
                cancelPendingVideo();
                props.close();
              }
            },
            t("videoLargeCancel")
          ),
          el(
            Button,
            {
              size: "sm",
              colorScheme: "orange",
              onClick: function() {
                acceptPendingVideo();
                props.close();
              }
            },
            t("videoLargeContinue")
          )
        )
      );
    };
  }

  
