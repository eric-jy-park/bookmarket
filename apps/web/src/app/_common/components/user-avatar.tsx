"use client";

import Link from "next/link";
import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/app/_core/components/avatar";
import { type User } from "~/app/(pages)/(auth)/types";
import { LogOutIcon, UserRoundIcon } from "lucide-react";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "~/app/_core/components/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuLabel,
} from "~/app/_core/components/dropdown-menu";
import { DropdownMenu } from "~/app/_core/components/dropdown-menu";
import { DropdownMenuTrigger } from "~/app/_core/components/dropdown-menu";
import { signOut } from "../actions/auth.action";

export const UserAvatar = ({ user }: { user: User }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer rounded-md">
          <AvatarImage src={user.picture} alt={user.email} />
          <AvatarFallback>
            <UserRoundIcon
              size={16}
              className="opacity-60"
              aria-hidden="true"
            />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64">
        <DropdownMenuLabel className="flex items-center gap-3">
          <Avatar className="rounded-md">
            <AvatarImage src={user.picture} alt={user.email} />
            <AvatarFallback>
              <UserRoundIcon
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-foreground">
              {user.id}
            </span>
            <p className="truncate text-xs font-normal text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
