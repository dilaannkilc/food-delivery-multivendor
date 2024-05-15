import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { GET_TICKET_USERS, GET_USER_SUPPORT_TICKETS, GET_TICKET_MESSAGES } from '@/lib/api/graphql/queries/supportTickets';
import { CREATE_TICKET_MESSAGE, UPDATE_TICKET_STATUS } from '@/lib/api/graphql/mutations/supportTickets';
import UserTicketCard from '@/lib/ui/useable-components/user-ticket-card';
import TicketCard from '@/lib/ui/useable-components/ticket-card';
import TicketChatModal from '@/lib/ui/useable-components/ticket-chat-modal';
import NoData from '@/lib/ui/useable-components/no-data';
import HeaderText from '@/lib/ui/useable-components/header-text';
import UserTicketSkeleton from '@/lib/ui/useable-components/custom-skeletons/user-ticket.skeleton';
import TicketCardSkeleton from '@/lib/ui/useable-components/custom-skeletons/ticket-card.skeleton';
import { Chip } from 'primereact/chip';

export interface ICustomerSupportMainProps {
  activeTab?: 'tickets' | 'chats';
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface ITicket {
  _id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  orderId?: string;
  otherDetails?: string;
  createdAt: string;
  updatedAt: string;
  user: IUser;
  lastMessageAt?: string;
}

interface UserWithLatestTicket {
  user: IUser;
  latestTicket: ITicket | null;
  lastUpdated: number; 
}

export default function CustomerSupportMain({ activeTab = 'tickets' }: ICustomerSupportMainProps) {

  const t = useTranslations();
  const client = useApolloClient();

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isChatModalVisible, setIsChatModalVisible] = useState<boolean>(false);
  const [page] = useState<number>(1);
  const [limit] = useState<number>(20);
  const [usersWithTickets, setUsersWithTickets] = useState<UserWithLatestTicket[]>([]);
  const [showTicketSkeleton, setShowTicketSkeleton] = useState<boolean>(false);
  const [sortedTickets, setSortedTickets] = useState<ITicket[]>([]);

  const initialDataLoaded = useRef<boolean>(false);
  const pollingIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPolledAt = useRef<number>(Date.now());

  const { data: usersData, loading: usersLoading, error: usersError, refetch: refetchUsers } = useQuery(
    GET_TICKET_USERS,
    {
      variables: {
        input: {
          page,
          limit
        }
      },
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true,
    }
  );

  const { data: ticketsData, loading: ticketsLoading, error: ticketsError, refetch: refetchTickets } = useQuery(
    GET_USER_SUPPORT_TICKETS,
    {
      variables: {
        input: {
          userId: selectedUserId,
          filters: {
            page: 1,
            limit: 50
          }
        }
      },
      skip: !selectedUserId,
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true,
      onCompleted: () => {
        setShowTicketSkeleton(false);
      }
    }
  );

  const [createMessage, { loading: isSendingMessage }] = useMutation(CREATE_TICKET_MESSAGE, {
    onCompleted: () => {
      if (selectedTicketId) {

        refetchTickets();

        if (selectedUserId) {
          fetchLatestUserTickets([selectedUserId]);
        }
      }
    }
  });

  const [updateTicketStatus, { loading: isUpdatingStatus }] = useMutation(UPDATE_TICKET_STATUS, {
    onCompleted: () => {
      refetchTickets();

      if (selectedUserId) {
        fetchLatestUserTickets([selectedUserId]);
      }
    }
  });

  const users: IUser[] = usersData?.getTicketUsers?.users || [];

  const sortUsersByLatestActivity = (users: UserWithLatestTicket[]): UserWithLatestTicket[] => {
    return [...users].sort((a, b) => {

      const getLatestTimestamp = (user: UserWithLatestTicket): number => {
        if (!user.latestTicket) return 0;

        const timestamp = user.latestTicket.lastMessageAt || user.latestTicket.updatedAt;
        try {
          return parseInt(timestamp);
        } catch (error) {
          return 0;
        }
      };

      return getLatestTimestamp(b) - getLatestTimestamp(a);
    });
  };

  useEffect(() => {
    if (initialDataLoaded.current) {
      refetchUsers();
    }
  }, [refetchUsers]);

  useEffect(() => {
    if (ticketsData && !ticketsLoading) {

      const userTickets: ITicket[] = ticketsData?.getSingleUserSupportTickets?.tickets || [];

      const sorted = [...userTickets].sort((a, b) => {
        const getTimestamp = (ticket: ITicket): number => {
          const timestamp = ticket.lastMessageAt || ticket.updatedAt;
          try {
            return parseInt(timestamp);
          } catch (error) {
            return 0;
          }
        };

        return getTimestamp(b) - getTimestamp(a);
      });

      setSortedTickets(sorted);
    }
  }, [ticketsData, ticketsLoading]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(parseInt(dateString));
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return "unknown date";
    }
  };

  const fetchUserLatestTicket = async (userId: string): Promise<UserWithLatestTicket | null> => {
    try {

      const { data } = await client.query({
        query: GET_USER_SUPPORT_TICKETS,
        variables: {
          input: {
            userId,
            filters: {
              page: 1,
              limit: 10
            }
          }
        },
        fetchPolicy: "network-only"
      });

      const user = users.find(u => u._id === userId);
      if (!user) return null;

      const userTickets = data?.getSingleUserSupportTickets?.tickets || [];
      let latestTicket: ITicket | null = null;

      if (userTickets.length > 0) {

        const sortedTickets = [...userTickets].sort((a, b) => {
          const getTimestamp = (ticket: ITicket): number => {
            const timestamp = ticket.lastMessageAt || ticket.updatedAt;
            try {
              return parseInt(timestamp);
            } catch (error) {
              return 0;
            }
          };

          return getTimestamp(b) - getTimestamp(a);
        });

        if (sortedTickets.length > 0) {
          latestTicket = sortedTickets[0];

          if (latestTicket) {
            try {
              const { data: messageData } = await client.query({
                query: GET_TICKET_MESSAGES,
                variables: {
                  input: {
                    ticket: latestTicket._id,
                    page: 1,
                    limit: 1, 
                  }
                },
                fetchPolicy: "network-only"
              });

              const messages = messageData?.getTicketMessages?.messages || [];
              if (messages.length > 0) {

                latestTicket = {
                  ...latestTicket,
                  lastMessageAt: messages[0].createdAt
                };
              }
            } catch (error) {
              console.log("Error fetching messages for ticket:", error);
            }
          }
        }
      }

      return {
        user,
        latestTicket,
        lastUpdated: Date.now()
      };
    } catch (error) {
      console.error("Error fetching user ticket:", error);
      return null;
    }
  };

  const fetchLatestUserTickets = async (userIds: string[] = []) => {
    if (userIds.length === 0) return;

    try {
      const promises = userIds.map(userId => fetchUserLatestTicket(userId));
      const results = await Promise.all(promises);

      const validResults = results.filter(Boolean) as UserWithLatestTicket[];

      setUsersWithTickets(prevUsers => {
        const updatedUsers = [...prevUsers];

        validResults.forEach(newUserData => {
          const existingIndex = updatedUsers.findIndex(u => u.user._id === newUserData.user._id);

          if (existingIndex >= 0) {

            updatedUsers[existingIndex] = newUserData;
          } else {

            updatedUsers.push(newUserData);
          }
        });

        return sortUsersByLatestActivity(updatedUsers);
      });
    } catch (error) {
      console.error("Error fetching latest user tickets:", error);
    }
  };

  const fetchAllUsersLatestTickets = useCallback(async (firstLoad: boolean = false) => {
    if (usersLoading || !users.length) return;

    try {

      const userTicketsPromises = users.map(async (user: IUser) => {
        return fetchUserLatestTicket(user._id);
      });

      const results = await Promise.all(userTicketsPromises);

      const validResults = results.filter(Boolean) as UserWithLatestTicket[];

      const sortedResults = sortUsersByLatestActivity(validResults);

      setUsersWithTickets(sortedResults);

      if (!selectedUserId && sortedResults.length > 0) {
        setSelectedUserId(sortedResults[0].user._id);
      }

      if (firstLoad && !initialDataLoaded.current) {
        initialDataLoaded.current = true;
      }
    } catch (error) {
      console.error("Error fetching all user tickets:", error);
    }
  }, [users, usersLoading, selectedUserId, client]);

  useEffect(() => {
    if (!usersLoading && users.length > 0 && !initialDataLoaded.current) {
      fetchAllUsersLatestTickets(true);
    }
  }, [usersLoading, users, fetchAllUsersLatestTickets]);

  useEffect(() => {

    const pollForUpdates = async () => {

      if (initialDataLoaded.current && users.length > 0) {
        const now = Date.now();

        if (now - lastPolledAt.current >= 15000) {
          lastPolledAt.current = now;

          await refetchUsers();

          fetchAllUsersLatestTickets();

          if (selectedUserId) {
            refetchTickets();
          }
        }
      }
    };

    pollingIntervalRef.current = setInterval(pollForUpdates, 30000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [refetchUsers, users, selectedUserId, refetchTickets, fetchAllUsersLatestTickets]);

  const handleUserSelect = (userId: string) => {
    if (userId !== selectedUserId) {
      setShowTicketSkeleton(true);
      setSelectedUserId(userId);
      setSelectedTicketId(null);
    }
  };

  const handleTicketSelect = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setIsChatModalVisible(true);
  };

  const handleChatModalClose = () => {
    setIsChatModalVisible(false);

    setTimeout(() => {
      refetchTickets();
      if (selectedUserId) {
        fetchLatestUserTickets([selectedUserId]);
      }
    }, 300);
  };

  const handleSendMessage = (message: string) => {
    if (!selectedTicketId || isSendingMessage) return;

    createMessage({
      variables: {
        messageInput: {
          content: message,
          ticket: selectedTicketId
        }
      }
    });
  };

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    if (isUpdatingStatus) return;

    updateTicketStatus({
      variables: {
        input: {
          ticketId,
          status: newStatus
        }
      }
    });
  };

  const isLoading = usersLoading && !initialDataLoaded.current;

  return (
    <div className="flex flex-grow flex-col overflow-hidden sm:flex-row">
      {}
      <div
        className={`w-full overflow-y-auto border-gray-200 border dark:border-dark-600 bg-white dark:bg-dark-950 sm:w-1/3 ${activeTab === 'tickets' ? '' : 'hidden sm:block'
          }`}
      >
        {}
        <div className="mt-3 border-b dark:border-dark-600 p-3 sm:hidden">
          <div className="mb-4 flex items-center justify-between">
            <HeaderText text={t('Support Users')} />
          </div>
        </div>

        {}
        <div className="pb-16">
          {isLoading ? (
            <UserTicketSkeleton count={5} />
          ) : usersError ? (
            <div className="p-4 text-center text-red-500">Error loading users</div>
          ) : usersWithTickets.length > 0 ? (
            usersWithTickets.map(({ user, latestTicket }: UserWithLatestTicket) => (
              <UserTicketCard
                key={user._id}
                user={user}
                latestTicket={latestTicket}
                isSelected={selectedUserId === user._id}
                onClick={() => handleUserSelect(user._id)}
                formatDate={formatDate}
              />
            ))
          ) : (
            <NoData message={t('no_user_found')} />
          )}
        </div>
      </div>

      {}
      <div
        className={`flex-1 overflow-y-auto border-l border-gray-200 dark:border-dark-600 px-2 ${activeTab === 'chats' ? '' : 'hidden sm:block'
          }`}
      >
        {}
        <div className="border-b dark:border-dark-600  pb-2 pt-3">
          <div className="mb-4 flex items-center justify-between">
            <div className="hidden sm:block">
              <HeaderText text={t('ticket_chats')} />
            </div>
            <div className="flex flex-col sm:hidden">
              <HeaderText text={t('ticket_chats')} />
              {selectedUserId && (
                <Chip
                  label={users.find((u: IUser) => u._id === selectedUserId)?.name || 'User'}
                  className="w-full"
                />
              )}
            </div>
          </div>
        </div>

        {}
        <div className="pb-16">
          {!selectedUserId ? (
            <div className="flex items-center justify-center p-8">
              <p className="text-gray-500 dark:text-white">{t('select_a_user_to_view_tickets')}</p>
            </div>
          ) : showTicketSkeleton || (ticketsLoading && !sortedTickets.length) ? (
            <TicketCardSkeleton count={3} />
          ) : ticketsError ? (
            <div className="p-4 text-center text-red-500">Error loading tickets</div>
          ) : sortedTickets.length > 0 ? (
            sortedTickets.map((ticket: ITicket) => (
              <TicketCard
                key={ticket._id}
                ticket={ticket}
                onClick={() => handleTicketSelect(ticket._id)}
              />
            ))
          ) : (
            <div className="flex items-center justify-center p-8">
              <p className="text-gray-500">{t('No tickets found for this user')}</p>
            </div>
          )}
        </div>
      </div>

      {}
      {selectedTicketId && (
        <TicketChatModal
          visible={isChatModalVisible}
          onHide={handleChatModalClose}
          ticketId={selectedTicketId}
          onSendMessage={handleSendMessage}
          onStatusChange={handleStatusChange}
          isAdmin={true}
        />
      )}
    </div>
  );
}