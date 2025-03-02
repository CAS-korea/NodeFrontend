import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "../../lib/utils"

import "./tooltip.css";

const TooltipProvider = ({ children, ...props }: TooltipPrimitive.TooltipProviderProps) => (
    <TooltipPrimitive.Provider
        delayDuration={100} // Longer delay before showing tooltip
        skipDelayDuration={300} // Shorter delay when moving between tooltips
        {...props}
    >
        {children}
    </TooltipPrimitive.Provider>
)

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
    React.ElementRef<typeof TooltipPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, ...props }, ref) => (
    <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
            ref={ref}
            className={cn(
                "text-black dark:text-white z-50 overflow-hidden rounded-md bg-primary py-1.5 text-xs text-primary-foreground tooltip-content-slow data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                className,
            )}
            // Add longer delay before tooltip disappears
            duration={2000} // 2 seconds before auto-hiding (if supported by Radix)
            {...props}
        />
    </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }

