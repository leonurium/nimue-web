import { TypeMessage } from "~/types";

export default () => {
    const showMessage = (message: string, type: TypeMessage = TypeMessage.info) => {
        if (!type) {
            return useToast().toast({
                description: message,
            });
        }
        if (type === "action") {
            return useToast().toast({
                title: getToastTitle(type),
                icon: getToasticon(type),
                description: message,
                action: h(
                    resolveComponent("UiToastAction"),
                    {
                        altText: "Undo",
                    },
                    {
                        default: () => "Undo",
                    }
                ),
            });
        }
        return useToast().toast({
            title: getToastTitle(type),
            description: message,
            variant: type,
            icon: getToasticon(type),
        });
    };

    const getToasticon = (type: TypeMessage) => {
        switch (type) {
            case TypeMessage.action:
                return "lucide:mail"
            case TypeMessage.info:
                return "lucide:badge-info";
            case TypeMessage.success:
                return "lucide:badge-check";
            case TypeMessage.warning:
                return "lucide:badge-alert";
            case TypeMessage.destructive:
                return "lucide:badge-x";
        }
    };

    const getToastTitle = (type: TypeMessage) => {
        switch (type) {
            case TypeMessage.action:
                return TypeMessage.action.toUpperCase()
            case TypeMessage.info:
                return TypeMessage.info.toUpperCase()
            case TypeMessage.success:
                return TypeMessage.success.toUpperCase()
            case TypeMessage.warning:
                return TypeMessage.warning.toUpperCase()
            case TypeMessage.destructive:
                return "ERROR"
        }
    }

    return {
        showMessage
    }
}